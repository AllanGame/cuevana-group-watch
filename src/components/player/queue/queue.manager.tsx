import styles from '../../../styles/components/QueueManager.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Group from "../../../groups/group";
import User from "../../../users/user";
import QueueItem from "./item/queue.item";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {NextPage} from "next";
import axios from "axios";
import {useEffect, useState} from "react";
import SearchItem from "./item/search.item";
import SearchContainer from "./container/search.container";
import QueueContainer from "./container/queue.container";

const URL_REGEX = new RegExp(
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
);

interface Props {
    group: Group;
    viewer: User;
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const QueueManager: NextPage<Props> = (props): JSX.Element => {

    const [queueContainerState, setQueueContainerState] = useState({
        searching: false,
        searched: false,
        searchItems: [],
        queueItems: []
    }) as any;

    useEffect(() => {
        console.log(queueContainerState);
    }, [queueContainerState, setQueueContainerState])

    return (
        <div className={styles.queueManagerContainer}>
            <div className={styles.searchContainer}>
                <input className={styles.searchInput} type="text" name="searchInput" id="searchInput" placeholder="Search or paste video" onChange={handleTyping} onKeyPress={handleEnterKey}/>
                <FontAwesomeIcon className={styles.searchBtn} icon="arrow-right" color="#AB9393" onClick={handleSearch}/>
            </div>
            {queueContainerState.searching ?
                <SearchContainer
                    className={styles.queueContainer}
                    searchItems={queueContainerState.searchItems}
                    searched={queueContainerState.searched}
                    stateModifier={setQueueContainerState}
                />
                :
                <QueueContainer
                    className={styles.queueContainer}
                    queueItems={queueContainerState.queueItems}
                />
            }
        </div>
    )


    function handleEnterKey(e: any) {
        if(e.charCode == 13 && e.target.value.length > 0) {
            handleSearch()
        }
    }

    function handleTyping(e: any) {
        let searchBtn = document.getElementsByClassName(styles.searchBtn)[0] as any;
        if(e.target.value.length > 0) {
            searchBtn.style.display = "block"
            setQueueContainerState((prevState: any) => {
                return {
                    ...prevState,
                    searching: true,
                    searched: false
                }
            });
        } else {
            searchBtn.style.display = "none"
            setQueueContainerState((prevState: any) => {
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
                url: 'http://localhost:3000/api/moviedata?url='+searchInput.value
            })

            let {title, poster} = originRequestResponse.data;
            setQueueContainerState((prevState: any) => {
                return {
                    ...prevState,
                    searchItems: [{
                        posterSrc: poster,
                        title,
                        duration: "1h 2m",
                        addedBy: props.viewer
                    }],
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