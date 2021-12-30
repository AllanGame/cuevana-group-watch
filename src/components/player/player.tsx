import { NextPage } from "next";
import Group from "../../groups/group";
import styles from '../../styles/components/Player.module.css'
import User from "../../users/user";
import QueueManager from "./queue/queue.manager";
import {SyntheticEvent, useContext, useEffect, useState} from "react";
import io, { Socket } from "socket.io-client";
import {GroupContext} from "../../groups/group.context";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {ViewState} from "../../common/types";

interface Props {
    group: Group
    viewer: User;
}

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const Player: NextPage<Props> = (props): JSX.Element => {
    const {group, setGroup} = useContext(GroupContext) as any;
    const [viewState, setViewState] = useState<ViewState>({
        time: 0,
        playing: false,
        groupId: group.id,
        user: props.viewer
    })

    useEffect(() => {
        socket = io()
        socket.on('connect', () => {
            console.log('connected')
            socket.emit('joinRoom', {
                group: props.group,
                user: props.viewer
            })
        });

        socket.on('roomUpdate', (newGroup) => {
            setGroup(newGroup);
        })

        socket.on('viewUpdate', (viewState: ViewState) => {
            if(viewState.user.nickname === props.viewer.nickname) {
                return;
            }

            let video = document.getElementById('player') as HTMLVideoElement
            video.currentTime = viewState.time;
            viewState.playing ? video.play() : video.pause();
            console.log('new viewUpdate', viewState);
            setViewState(viewState);
        })

        socket.on('userJoin', (newUser) => {
            console.log(newUser.nickname + " has joined to the group")
        })

        socket.on('disconnect', () => {
            // Emit roomDisconect
            console.log('disconnect')
        })
    }, [])

    function handlePlay(event: SyntheticEvent<HTMLVideoElement, Event>) {
        socket.emit('viewUpdate', {
            ...viewState,
            time: event.currentTarget.currentTime,
            playing: !event.currentTarget.paused,
            user: props.viewer
        } as ViewState);
    }

    function handlePause(event: SyntheticEvent<HTMLVideoElement, Event>) {
        socket.emit('viewUpdate', {
            ...viewState,
            time: event.currentTarget.currentTime,
            playing: !event.currentTarget.paused,
            user: props.viewer
        } as ViewState);
    }

    return (
        <div className={styles.playerContainer}>
            <div className={styles.queueManagerWrapper}>
                <QueueManager group={props.group} viewer={props.viewer} socket={socket}/>
            </div>
            <video
                src="https://cdn.discordapp.com/attachments/856551768317755432/925527214173335562/1171F04B-9802-4A90-B9D1-0E37897B6993.mov"
                id="player"
                className={styles.video}
                controls
                onPlay={handlePlay}
                onPause={handlePause}
            />
        </div>
    )    
}

export default Player;