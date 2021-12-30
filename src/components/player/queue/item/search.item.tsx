import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../../../../styles/components/queue.item.module.css';
import {NextPage} from "next";

interface Props {
    posterSrc: string;
    title: string;
    onAdd: () => void
}

const SearchItem: NextPage<Props> = (props): JSX.Element => {
    return (
        <div className={styles.itemContainer}>
            <div className={styles.action}>
                <FontAwesomeIcon
                    className={styles.addBtn}
                    icon="plus"
                    color="#AB9393"
                    onClick={props.onAdd}/>
            </div>
            <div className={styles.card}>
                <img className={styles.poster} src={props.posterSrc} alt={`${props.title} poster`} />
                <div className={styles.textData}>
                    <h1 className={styles.itemTitle}>{props.title}</h1>
                </div>
            </div>
        </div>
    )
}

export default SearchItem;