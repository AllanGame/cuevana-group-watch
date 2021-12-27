import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component, ReactNode } from "react";
import styles from '../styles/components/queue.item.module.css';
import User from "../users/user";

interface Props {
    posterSrc: string;
    title: string;
    duration: string;
    addedBy: User;
}

export default class QueueItem extends Component<Props> {
    constructor(props: Props | Readonly<Props>) {
        super(props);
    }

    render(): ReactNode {
        return (
            <div className={styles.itemContainer}>
                <div className={styles.dragWrapper}>
                    <FontAwesomeIcon icon="grip-vertical" color="#AB9393"/>
                </div>
                <div className={styles.card}>
                    <img className={styles.poster} src={this.props.posterSrc} alt="movie poster" />
                    <div className={styles.textData}>
                        <h1 className={styles.itemTitle}>{this.props.title}</h1>
                        <p className={styles.gray + " " + styles.duration}>{this.props.duration}</p>
                        <p className={styles.gray + " " + styles.addedBy}>By {this.props.addedBy.nickname}</p>
                    </div>
                </div>
            </div>
        )
    }
}