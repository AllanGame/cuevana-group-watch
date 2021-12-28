import { NextPage } from "next";
import Group from "../groups/group";
import styles from '../styles/components/Player.module.css'
import User from "../users/user";
import QueueManager from "./queue.manager";
interface Props {
    group: Group
    viewer: User;
}

const Player: NextPage<Props> =  (props): JSX.Element => {
    return (
        <div className={styles.playerContainer}>
            <div className={styles.queueManagerWrapper}>
                <QueueManager group={props.group} viewer={props.viewer}/>
            </div>
            <video id="player" className={styles.video} controls/>
        </div>
    )    
}

export default Player;