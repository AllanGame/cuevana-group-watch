import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../../../../styles/components/queue.item.module.css';
import User from "../../../../users/user";
import {NextPage} from "next";

interface Props {
    posterSrc: string;
    title: string;
    duration: string;
    addedBy: User;
}

const QueueItem: NextPage<Props> = (props): JSX.Element => {
    return (
        <div className={styles.itemContainer}>
            <div className={styles.action}>
                <FontAwesomeIcon className={styles.dragBtn} icon="grip-vertical" color="#AB9393"/>
            </div>
            <div className={styles.card}>
                <img className={styles.poster} src={props.posterSrc} alt={`${props.title} poster`} />
                <div className={styles.textData}>
                    <h1 className={styles.itemTitle}>{props.title}</h1>
                    <p className={styles.duration}>{props.duration}</p>
                    <p className={styles.addedBy}>By {props.addedBy.nickname}</p>
                </div>
            </div>
        </div>
    )
}

export default QueueItem;