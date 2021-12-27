import { NextPage } from "next";
import Video from "../common/video";
import Group from "../groups/group";
import styles from '../styles/components/Player.module.css'
import User from "../users/user";
import QueueManager from "./queue.manager";

interface Props {
    group: Group
    viewer: User;
}

const Player: NextPage<Props> = (props): JSX.Element => {
    
    // async function addToQueue() {
    //     console.log('coso')
    //     let queueInput = document.getElementById('cuevanaurl') as any;
    //     if(!queueInput.value) {
    //         alert('Invalid URL')
    //         return;
    //     }

    //     fetch('http://localhost:3000/api/cuevana?url='+queueInput.value)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         if(data.error) {
    //             alert('invalid url')
    //             queueInput.value = '';
    //             return;
    //         }

    //         let vid = new Video(data.src, props.viewer, queueInput.value);
    //         console.log(vid);
    //         queueInput.value = '';
    //     })
        
    // }

    return (
        <div className={styles.playerContainer}>
            <div className={styles.queueManagerWrapper}>
                <QueueManager group={props.group} viewer={props.viewer}></QueueManager>     
            </div>
            <video className={styles.video} src='https://cdn.discordapp.com/attachments/804498423671029771/921606158106636298/TROLEADOR_CARA.mp4' controls></video>
        </div>
    )
}

export default Player;