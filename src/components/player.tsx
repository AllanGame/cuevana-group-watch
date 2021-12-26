import { NextPage } from "next";
import Video from "../common/video";
import styles from '../styles/components/Player.module.css'
import User from "../users/user";

interface Props {
    queue: Video[]
    viewer: User;
}

const Player: NextPage<Props> = (props): JSX.Element => {
    
    async function addToQueue() {
        console.log('coso')
        let queueInput = document.getElementById('cuevanaurl') as any;
        if(!queueInput.value) {
            alert('Invalid URL')
            return;
        }

        fetch('http://localhost:3000/api/cuevana?url='+queueInput.value)
        .then((response) => response.json())
        .then((data) => {
            if(data.error) {
                alert('invalid url')
                queueInput.value = '';
                return;
            }

            let vid = new Video(data.src, props.viewer, queueInput.value);
            console.log(vid);
            props.queue.push(vid);
            queueInput.value = '';
            renderQueue();
        })
        
    }


    function renderQueue() {
        let queueElement = document.getElementById('queue');
        let queueItem = document.createElement('div');
        let videoUrl = document.createElement('p');
        props.queue.forEach((video, i) => {
            queueItem.className = styles.queueItem;
            videoUrl.className = styles.videoUrl;
            videoUrl.innerHTML = `<span className={styles.nose}>${i+1}.</span> ${video.origin}`;

            queueItem.appendChild(videoUrl);
            queueElement?.appendChild(queueItem);
        })
    }

    return (
        <div className={styles.playerContainer}>
            <div className={styles.queueManager}>
                <input type="text" name="cuevanaurl" id="cuevanaurl" placeholder="Type Cuevana URL"/>
                <button onClick={addToQueue}>add</button>
                <h3>Queue</h3>
                {renderQueue()}
                <div id="queue"></div>
            </div>            

            <video className={styles.video} src='https://cdn.discordapp.com/attachments/804498423671029771/921606158106636298/TROLEADOR_CARA.mp4' controls></video>
        </div>
    )
}

export default Player;