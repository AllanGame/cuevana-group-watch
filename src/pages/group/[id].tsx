import { NextPage, NextPageContext } from "next";
import Button from "../../components/ui/button";
import Player from "../../components/player/player";
import styles from '../../styles/Group.module.css'
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../users/user.context";
import {GroupContext, IGroupContext} from "../../groups/group.context";
import Group from "../../groups/group";
import io, {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {ISocketContext, SocketContext} from "../../context/socket.context";


const GroupPage: NextPage = (props: any) => {
    const [group, setGroup] = useState<Group>(props.group);
    const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>(null as any);
    const {user} = useContext(UserContext) as any;

    useEffect(() => {
        if(!user[0]) {
            return;
        }

        fetch('/api/socketio').then(() => {
            let socket = io();
            socket.on('connect', () => {
                socket.emit('joinRoom', {
                    group: props.group,
                    user: user[0]
                })
            });

            socket.on('groupUpdate', (newGroup: Group) => {
                // Update group
                setGroup(newGroup);

                // Update view state
                let newViewState = newGroup.viewState;
                let video = document.getElementById('player') as HTMLVideoElement;
                video.currentTime = newViewState.time;
                newViewState.playing ? video.play() : video.pause();
            })

            socket.on('userJoin', (newUser) => {
                // Show a popup
                console.log(newUser.nickname + " has joined to the group")

                // Add user to the group
                group.members.push(newUser);
                setGroup(group);
            })

            socket.on('disconnect', () => {
                // Show a pop up and emit the disconnection
                console.log('disconnect')
            })

            setSocket(socket);
        })
    }, [])

    if(props.group.error) {
        return (
            <div className={styles.notFound}>
                <h1>Cannot find that group.</h1>
                <Button type="primary" href="/">Go back</Button>
            </div>
        )
    }

    if(!user[0]) {
        return (
            <div className={styles.notFound}>
                <h1>You haven&apos;t registered yet.</h1>
                <Button type="primary" href="/">Go back</Button>
            </div>
        )
    }

    if(!socket) {
        return (
            <div className={styles.notFound}>
                <h1>Loading, wait a second.</h1>
            </div>
        )
    }

    return (
        <GroupContext.Provider value={{group, setGroup} as IGroupContext}>
            <SocketContext.Provider value={{socket, setSocket} as ISocketContext}>
                <div className={styles.container}>
                    <Player group={props.group} viewer={user[0]}/>
                    <div className={styles.debug}>
                        <p>DEBUG not finished</p>
                    </div>
                </div>
            </SocketContext.Provider>
        </GroupContext.Provider>
    )
}

export async function getServerSideProps(context: NextPageContext) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/groups/${context.query.id}`);
    const group = await res.json();

    return {
      props: {
        group
      },
    };
}

export default GroupPage;