import {NextPage} from "next";
import Group from "../../groups/group";
import styles from '../../styles/components/Player.module.css'
import User from "../../users/user";
import QueueManager from "./queue/queue.manager";
import {SyntheticEvent, useCallback, useContext, useEffect, useState} from "react";
import {GroupContext, IGroupContext} from "../../context/group.context";
import {LocalViewConfig} from "../../common/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Video from "../../common/video";
import {ISocketContext, SocketContext} from "../../context/socket.context";

interface Props {
    group: Group
    viewer: User;
}

// TODO: video.currentTime = ... is very slow, find another way to make it faster
// TODO: Move all functions to another file called player.interactions.tsx
// TODO: Show tooltip with time when hovering the progress bar
const Player: NextPage<Props> = (props): JSX.Element => {
    const {group, setGroup} = useContext<IGroupContext>(GroupContext);
    const {socket} = useContext<ISocketContext>(SocketContext);

    const [isQueueManagerVisible, setIsQueueManagerVisible] = useState(true);
    const [localViewConfig, setLocalViewConfig] = useState<LocalViewConfig>({fullscreen: false, volume: 100})
    const [currentVideo, setCurrentVideo] = useState<Video | undefined>(undefined);

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
                <QueueManager group={group} viewer={props.viewer}/>
            </div>

            {/*Video*/}
            <div className={styles.videoWrapper} >
                <video
                    id="player"
                    src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    className={styles.video}
                    onTimeUpdate={handleTimeUpdate}
                    onClick={togglePlay}
                />

                {/* Custom Controls */}
                <div className={styles.controller}>
                    <div className={styles.progressWrapper} onClick={handleSeek}>
                        <div className={styles.videoProgress} id="videoProgress">
                            <div className={styles.videoProgressFilled} id="videoProgressFilled"/>
                        </div>
                    </div>
                    <div className={styles.controls}>
                        <div className={styles.options}>
                            <div className={styles.leftOptions}>
                                <FontAwesomeIcon className={styles.option} icon={group.viewState.playing ? 'pause' : 'play'} onClick={togglePlay}/>
                                <FontAwesomeIcon className={styles.option} icon="undo" onClick={rewind}/>
                                <FontAwesomeIcon className={styles.option} icon="volume-up"/>
                                {/*Toggle QueueManager Visible*/}
                                <FontAwesomeIcon className={styles.option} icon={isQueueManagerVisible ? 'chevron-left' : 'chevron-right'} onClick={() => {
                                    setIsQueueManagerVisible(prevState => !prevState);
                                }}/>
                            </div>
                            <p id="timeIndicator">00:00 / 00:00</p>
                            <div className={styles.rightOptions}>
                                <FontAwesomeIcon className={styles.option} icon="cog" onClick={togglePlay}/>
                                <FontAwesomeIcon className={styles.option} icon={localViewConfig.fullscreen ? 'expand' : 'compress'} onClick={toggleFullscreen}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // Interactions

    // TODO: rewind and jump are literally the same
    function rewind() {
        const video = document.getElementById('player') as HTMLVideoElement;
        const newTime = video.currentTime - 5;
        video.currentTime = newTime;

        setGroup((prevState) => {
            let newGroup = {
                ...prevState,
                viewState: {
                    ...prevState.viewState,
                    time: newTime
                }
            } as Group;
            socket.emit('groupUpdate', newGroup);
            return newGroup;
        })
    }

    function jump() {
        const video = document.getElementById('player') as HTMLVideoElement;
        const newTime = video.currentTime + 5;
        video.currentTime = newTime;

        setGroup((prevState) => {
            let newGroup = {
                ...prevState,
                viewState: {
                    ...prevState.viewState,
                    time: newTime
                }
            } as Group;
            socket.emit('groupUpdate', newGroup);
            return newGroup;
        })
    }

    function handleSeek(event: any) {
        const video = document.getElementById('player') as HTMLVideoElement;
        const progress = document.getElementById('videoProgress') as any;
        video.currentTime = (event.nativeEvent.offsetX / progress.offsetWidth) * video.duration;

        setGroup((prevState) => {
            let newGroup = {
                ...prevState,
                viewState: {
                    ...prevState.viewState,
                    time: video.currentTime
                }
            } as Group;
            socket.emit('groupUpdate', newGroup);
            return newGroup;
        })
    }

    function handleTimeUpdate(event: SyntheticEvent<HTMLVideoElement, Event>) {
        const video = event.target as HTMLVideoElement;

        // Sends the latest time for syncing new users
        socket.emit('timeUpdate', {time: video.currentTime, group: group.id});

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

        setLocalViewConfig(prevState => {
            return {
                ...prevState,
                fullscreen: isFullScreen
            } as LocalViewConfig;
        });
    }

    async function togglePlay() {
        let video = document.getElementById('player') as HTMLVideoElement;

        await (group.viewState.playing ? video.pause() : video.play())

        // Modify viewState and send changes to server
        setGroup((prevState) => {
            let newGroup = {
                ...prevState,
                viewState: {
                    ...prevState.viewState,
                    time: video.currentTime,
                    playing: !group.viewState.playing
                }
            } as Group;
            socket.emit('groupUpdate', newGroup);
            return newGroup;
        })
    }

    function defaultEmit() {
    }
}

export default Player;