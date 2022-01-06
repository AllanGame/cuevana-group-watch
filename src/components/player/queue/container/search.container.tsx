import type {NextPage} from "next";
import SearchItem from "../item/search.item";
import {QueueManagerState} from "../../../../common/types";
import {Dispatch, SetStateAction, useContext} from "react";
import Video from "../../../../common/video";
import Group from "../../../../groups/group";
import {GroupContext, IGroupContext} from "../../../../context/group.context";
import {ISocketContext, SocketContext} from "../../../../context/socket.context";

interface Props {
    searched: boolean;
    searchItems: Video[];
    queueManagerStateModifier: Dispatch<SetStateAction<QueueManagerState>>;
    className: string;
}

/**
 * Used to show the results
 * when a user is searching for a video
 */
const SearchContainer: NextPage<Props> = (props): JSX.Element => {
    const {group, setGroup} = useContext<IGroupContext>(GroupContext);
    const {socket} = useContext<ISocketContext>(SocketContext)

    // TODO: remove duplicated code
    return (
        <div className={props.className}>
            {props.searched ?
                props.searchItems.map((item, index) =>
                    (
                        <SearchItem
                            key={`searchItem-${index}`}
                            posterSrc={item.data.posterSrc}
                            title={item.data.title}
                            onAdd={() => {
                                // Clear search input
                                const searchInput = document
                                    .getElementById('searchInput') as HTMLInputElement;
                                searchInput.value = '';

                                // Check if the queue is empty to mark it as
                                // isPlaying and add src property
                                if(group.viewState.queue.length < 1) {
                                    item.isPlaying = true;

                                    try {
                                        fetch(
                                            `${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/cuevana?url=${item.origin}`
                                        ).then(res => res.json())
                                            .then(data => {
                                                const video = document.getElementById('player') as HTMLVideoElement;
                                                item.data.src = data.src;
                                                video.src = data.src;
                                                setGroup((prevState) => {
                                                    let newGroup = {
                                                        ...prevState,
                                                        viewState: {
                                                            ...prevState.viewState,
                                                            queue: prevState.viewState.queue.concat([item])
                                                        }
                                                    } as Group;
                                                    socket.emit('groupUpdate', newGroup);
                                                    return newGroup;
                                                })

                                                props.queueManagerStateModifier(prevState => {
                                                    return {
                                                        ...prevState,
                                                        searching: false,
                                                        searched: false,
                                                    }
                                                })
                                            })
                                        return;
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }

                                // Add video to the group's queue
                                setGroup((prevState) => {
                                    let newGroup = {
                                        ...prevState,
                                        viewState: {
                                            ...prevState.viewState,
                                            queue: prevState.viewState.queue.concat([item])
                                        }
                                    } as Group;
                                    socket.emit('groupUpdate', newGroup);
                                    return newGroup;
                                })

                                // Stop searching view
                                props.queueManagerStateModifier(prevState => {
                                    return {
                                        ...prevState,
                                        searching: false,
                                        searched: false,
                                    }
                                })
                            }}
                        />
                    ))
                :
                <p>Press enter to search</p>
            }
        </div>
    )
}

export default SearchContainer;