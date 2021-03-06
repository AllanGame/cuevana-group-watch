import styles from '../../../styles/components/QueueManager.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Group from "../../../groups/group";
import User from "../../../users/user";
import {NextPage} from "next";
import axios from "axios";
import {useContext, useState} from "react";
import SearchContainer from "./container/search.container";
import QueueContainer from "./container/queue.container";
import {QueueManagerState, VideoData} from "../../../common/types";
import Video from "../../../common/video";
import {GroupContext, IGroupContext} from "../../../context/group.context";

const URL_REGEX = new RegExp(
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
);
const ENTER_KEY_CODE = 13;

interface Props {
    group: Group;
    viewer: User;
}

const QueueManager: NextPage<Props> = (props): JSX.Element => {
    const [queueManagerState, setQueueManagerState] = useState<QueueManagerState>({
        searching: false,
        searched: false,
        searchItems: [] as Video[],
        queueItems: [] as Video[]
    });

    const {group} = useContext<IGroupContext>(GroupContext);

    return (
        <div className={styles.queueManagerContainer}>
            <div className={styles.searchContainer}>
                <input className={styles.searchInput} type="text" name="searchInput" id="searchInput" placeholder="Search or paste video" onChange={handleTyping} onKeyPress={handleEnterKey}/>
                <FontAwesomeIcon className={styles.searchBtn} icon="arrow-right" color="#AB9393" onClick={handleSearch}/>
            </div>
            {queueManagerState.searching ?
                <SearchContainer
                    className={styles.queueContainer}
                    searchItems={queueManagerState.searchItems}
                    searched={queueManagerState.searched}
                    queueManagerStateModifier={setQueueManagerState}
                />
                :
                <QueueContainer
                    className={styles.queueContainer}
                    queueItems={group.viewState.queue}
                />
            }
        </div>
    )


    function handleEnterKey(e: any) {
        if(e.charCode == ENTER_KEY_CODE && e.target.value.length > 0) {
            handleSearch()
        }
    }

    function handleTyping(e: any) {
        let searchBtn = document.getElementsByClassName(styles.searchBtn)[0] as any;
        if(e.target.value.length > 0) {
            searchBtn.style.display = "block"
            setQueueManagerState((prevState: any) => {
                return {
                    ...prevState,
                    searching: true,
                    searched: false
                }
            });
        } else {
            searchBtn.style.display = "none"
            setQueueManagerState((prevState: any) => {
                return {
                    ...prevState,
                    searching: false,
                    searched: false
                }
            });
        }
    }

    async function handleSearch() {
        let searchInput = document.getElementById('searchInput') as any;
        if (!URL_REGEX.test(searchInput.value)) {
            alert('Invalid URL, im only supporting URLs, you cannot search by names :+1:')
            return;
        }

        try {
            let originRequestResponse = await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/moviedata?url=${searchInput.value}`
            })

            const {title, poster} = originRequestResponse.data;
            const itemData = {
                posterSrc: poster,
                title,
                duration: "1h 2m",
                addedBy: props.viewer,
                origin: searchInput.value,
                src: undefined
            } as VideoData;

            const item = new Video(searchInput.value, itemData, false);

            setQueueManagerState((prevState) => {
                return {
                    ...prevState,
                    searchItems: [item],
                    searching: true,
                    searched: true
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export default QueueManager;