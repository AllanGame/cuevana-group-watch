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


    // Update currentVideo when queue changes (If the playing video changes)
    useEffect(() => {
        let nowPlayingVideo: Video | undefined = group.viewState.queue.find((video: Video) => video.isPlaying);
        if (!nowPlayingVideo) {
            return;
        }

        if (JSON.stringify(currentVideo) == JSON.stringify(nowPlayingVideo)) {
            return;
        }

        setCurrentVideo(nowPlayingVideo);

    }, [group, setGroup])


    // Update video source when current video changes
    useEffect(() => {
        let nowPlayingVideo: Video = group.viewState.queue.find((video: Video) => video.isPlaying) as Video;
        if (!nowPlayingVideo) {
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/cuevana?url=${nowPlayingVideo.origin}`)
            .then(res => res.json())
            .then(data => {
                const video = document.getElementById('player') as HTMLVideoElement;
                video.src = data.src;
                nowPlayingVideo.data.src = data.src;

                setGroup(prevState => {
                    let newGroup = {
                        ...prevState,
                        viewState: {
                            ...prevState.viewState,
                            queue: prevState.viewState.queue.map((video) => video.isPlaying ? nowPlayingVideo : video)
                        }
                    } as Group;
                    return newGroup;
                })
            })
    }, [currentVideo, setCurrentVideo])

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
                    className={styles.video}
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
                                <FontAwesomeIcon className={styles.option} icon={group.viewState.playing ? 'pause' : 'play'} onClick={togglePlay}/>
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
                                <FontAwesomeIcon className={styles.option} icon={localViewConfig.fullscreen ? 'expand' : 'compress'} onClick={toggleFullscreen}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // Interactions

    function rewind() {
        const video = document.getElementById('player') as HTMLVideoElement;
        video.currentTime = video.currentTime - 5;

        defaultEmit()
    }

    function jump() {
        const video = document.getElementById('player') as HTMLVideoElement;
        video.currentTime = video.currentTime + 5;

        defaultEmit()
    }

    function handleProgressBarClick(event: any) {
        const video = document.getElementById('player') as HTMLVideoElement;
        const progress = document.getElementById('videoProgress') as any;
        video.currentTime = (event.nativeEvent.offsetX / progress.offsetWidth) * video.duration;

        defaultEmit()
    }

    function handleTimeUpdate(event: SyntheticEvent<HTMLVideoElement, Event>) {
        const video = event.target as HTMLVideoElement;

        socket.emit('timeUpdate', video.currentTime);

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

    function togglePlay() {
        let video = document.getElementById('player') as HTMLVideoElement;
        group.viewState.playing ? video.pause() : video.play();

        defaultEmit()
    }


    function defaultEmit() {
        const video = document.getElementById('video') as HTMLVideoElement;
        setGroup((prevState: Group) => {
            let newGroup = {
                ...prevState,
                viewState: {
                    ...prevState.viewState,
                    time: video.currentTime,
                    playing: !video.paused,
                }
            } as Group;
            socket.emit('groupUpdate', newGroup);
            return newGroup;
        })
    }
}

export default Player;