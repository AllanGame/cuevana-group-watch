import { Component, ReactNode } from "react";
import Video from "../common/video";
import styles from '../styles/components/QueueManager.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Group from "../groups/group";
import User from "../users/user";

const URL_REGEX = new RegExp(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
);

function handleEnterKey(e: any) {
    if(e.charCode == 13 && e.target.value.length > 0) {
        handleSearch()
    }
}

function handleTyping(e: any) {
    let searchBtn = document.getElementsByClassName(styles.searchBtn)[0] as any;
    if(e.target.value.length > 0) {
        searchBtn.style.display = "block"
    } else {
        searchBtn.style.display = "none"
    }
}

function handleSearch() {
    let searchInput = document.getElementById('searchInput') as any;
    if(!URL_REGEX.test(searchInput.value)) {
        alert('Invalid URL, im only supporting URLs, you cannot search by names :+1:')
        return;
    }

    try {
        fetch('http://localhost:3000/api/cuevana?url='+searchInput.value)
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    alert('An error has ocurred check console');
                    console.log(data.error);
                    return;  
                }

                console.log(data.src);
            })
    } catch(error) {
        alert('An error has ocurred check console');
        console.log(error);
    }

}

interface Props {
    group: Group;
    viewer: User;
}

export default class QueueManager extends Component<Props> {
    constructor(props: Props | Readonly<Props>) {
        super(props);
        this.state = {
            group: props.group
        }
    }

    render(): ReactNode {
        const {group} = this.state as any;
        return (
            <div className={styles.queueManagerContainer}>
                <div className={styles.searchContainer}>
                    <input className={styles.searchInput} type="text" name="searchInput" id="searchInput" placeholder="Search or paste video" onChange={handleTyping} onKeyPress={handleEnterKey}/>
                    <FontAwesomeIcon className={styles.searchBtn} icon="arrow-right" color="#AB9393" onClick={handleSearch}/>
                </div>
                <div className={styles.queueContainer}>
                    {group.queue.map((item: Video) => <p>{item.origin}</p>)}
                </div>
            </div>
        )
    }
}