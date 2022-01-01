import {NextPage} from "next";
import Group from "../../groups/group";
import styles from '../../styles/components/Player.module.css'
import User from "../../users/user";
import QueueManager from "./queue/queue.manager";
import {SyntheticEvent, useCallback, useContext, useEffect, useState} from "react";
import io, {Socket} from "socket.io-client";
import {GroupContext} from "../../groups/group.context";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {LocalViewState, ViewState} from "../../common/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Props {
    group: Group
    viewer: User;
}

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

// TODO: video.currentTime = ... is very slow, find another way to make it faster
// TODO: Move all functions to another file called player.interactions.tsx
// TODO: Show tooltip with time when hovering the progress bar
const Player: NextPage<Props> = (props): JSX.Element => {
    const {group, setGroup} = useContext(GroupContext) as any;
    const [isConnected, setIsConnected] = useState(false);
    const [isQueueManagerVisible, setIsQueueManagerVisible] = useState(true);
    const [viewState, setViewState] = useState<ViewState>({
        time: 0,
        playing: false,
        groupId: group.id,
        user: props.viewer
    })

    const [localViewState, setLocalViewState] = useState<LocalViewState>({
        fullscreen: false,
        volume: 100
    })

    useEffect(() => {
        // Prevent multiple connections
        if(!isConnected) {
            socket = io()
            socket.on('connect', () => {
                setIsConnected(true);
                socket.emit('joinRoom', {
                    group: props.group,
                    user: props.viewer
                })
            });

            socket.on('roomUpdate', (newGroup) => {
                setGroup(newGroup);
            })

            socket.on('viewUpdate', (newViewState: ViewState) => {
                console.log(newViewState);
                if(newViewState.user.nickname === props.viewer.nickname) {
                    return;
                }

                console.log(newViewState);
                let video = document.getElementById('player') as HTMLVideoElement;
                video.currentTime = newViewState.time;
                newViewState.playing ? video.play() : video.pause();
                setViewState(newViewState);
            })

            socket.on('userJoin', (newUser) => {
                console.log(newUser.nickname + " has joined to the group")
            })

            socket.on('disconnect', () => {
                // Emit roomDisconect
                console.log('disconnect')
            })
        }
    }, [])

    const handleKeyDown = useCallback((event) => {
        // Ignore when typing on queue manager search
        if(document.getElementById('searchInput') === document.activeElement) {
            return;
        }

        // <
        if(event.keyCode == 37) {
            rewind()
        }

        // >
        if(event.keyCode == 39) {
            jump();
        }

        // TODO: add space, JKL, F, M, I.
        //  See https://support.google.com/youtube/answer/7631406?hl=en

    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);

        return () => {
            document.removeEventListener("keydown", handleKeyDown, false);
        };
    }, []);

    return (
        <div className={styles.playerContainer} id="playerContainer">
            {/* QueueManager */}
            <div className={isQueueManagerVisible ? styles.queueManagerWrapper : styles.queueManagerWrapperInvisible}>
                <QueueManager group={props.group} viewer={props.viewer} socket={socket}/>
            </div>

            {/*Video*/}
            <div className={styles.videoWrapper} >
                <video
                    id="player"
                    className={styles.video}
                    src="https://media.vimejs.com/720p.mp4"
                    onTimeUpdate={handleTimeUpdate}
                    onClick={togglePlay}
                />

                {/* Custom Controls */}
                <div className={styles.controller}>
                    <div className={styles.progressWrapper} onClick={handleProgressBarClick}>
                        <div className={styles.videoProgress} id="videoProgress">
                            <div className={styles.videoProgressFilled} id="videoProgressFilled"/>
                        </div>
                    </div>
                    <div className={styles.controls}>
                        <div className={styles.options}>
                            <div className={styles.leftOptions}>
                                <FontAwesomeIcon className={styles.option} icon={viewState.playing ? 'pause' : 'play'} onClick={togglePlay}/>
                                <FontAwesomeIcon className={styles.option} icon="undo" onClick={rewind}/>
                                <FontAwesomeIcon className={styles.option} icon="volume-up" onClick={togglePlay}/>
                                {/*Toggle QueueManager Visible*/}
                                <FontAwesomeIcon className={styles.option} icon={isQueueManagerVisible ? 'chevron-left' : 'chevron-right'} onClick={() => {
                                    setIsQueueManagerVisible(prevState => !prevState);
                                }}/>
                            </div>
                            <p id="timeIndicator">00:00 / 00:00</p>
                            <div className={styles.rightOptions}>
                                <FontAwesomeIcon className={styles.option} icon="cog" onClick={togglePlay}/>
                                <FontAwesomeIcon className={styles.option} icon={localViewState.fullscreen ? 'expand' : 'compress'} onClick={toggleFullscreen}/>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )

    function rewind() {
        const video = document.getElementById('player') as HTMLVideoElement;
        video.currentTime = video.currentTime - 5;
    }

    function jump() {
        const video = document.getElementById('player') as HTMLVideoElement;
        video.currentTime = video.currentTime + 5;
    }

    function handleProgressBarClick(event: any) {
        const video = document.getElementById('player') as HTMLVideoElement;
        const progress = document.getElementById('videoProgress') as any;
        video.currentTime = (event.nativeEvent.offsetX / progress.offsetWidth) * video.duration;
    }

    function handleTimeUpdate(event: SyntheticEvent<HTMLVideoElement, Event>) {
        const video = event.target as HTMLVideoElement;

        // Modify progress bar
        const progressBar = document.getElementById('videoProgressFilled') as any;
        const percentage = (video.currentTime / video.duration) * 100
        progressBar.style.width = `${percentage}%`

        // Modify time indicator
        const timeIndicator = document.getElementById('timeIndicator') as any;

        const currentTime = formatSecondsAsTime(video.currentTime);
        const duration = formatSecondsAsTime(video.duration);

        timeIndicator.innerText = currentTime + ' / ' + duration;

        function formatSecondsAsTime(seconds: number) {
            const hour = Math.floor(seconds / 3600);
            let minute: any = Math.floor((seconds - (hour * 3600)) / 60);
            let second: any = Math.floor(seconds - (hour * 3600) - (minute * 60));

            if (minute < 10){
                minute = "0" + minute;
            }
            if (second < 10){
                second = "0" + second;
            }

            return (hour > 0 ? hour + ':' : '') + minute + ':' + second;
        }

    }

    function toggleFullscreen() {
        let player = document.getElementById('playerContainer') as HTMLDivElement;
        let isFullScreen = !(!window.screenTop && !window.screenY);

        isFullScreen ? document.exitFullscreen() : player.requestFullscreen();

        setLocalViewState(prevState => {
            return {
                ...prevState,
                fullscreen: isFullScreen
            } as LocalViewState;
        });
    }

    function togglePlay() {
        let video = document.getElementById('player') as HTMLVideoElement;
        viewState.playing ? video.pause() : video.play();
        setViewState(prevState => {
            let newViewState = {
                ...prevState,
                time: video.currentTime,
                playing: !video.paused,
                user: props.viewer
            } as ViewState;

            defaultEmit(newViewState);
            return newViewState;
        });
    }

    function defaultEmit(viewState: ViewState) {
        socket.emit('viewUpdate', viewState);

    }

}

export default Player;