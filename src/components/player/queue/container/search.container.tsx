import type {NextPage} from "next";
import SearchItem from "../item/search.item";
import {QueueManagerState} from "../../../../common/types";
import {Dispatch, SetStateAction, useContext} from "react";
import Video from "../../../../common/video";
import Group from "../../../../groups/group";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import {GroupContext, IGroupContext} from "../../../../groups/group.context";
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
    const {setGroup} = useContext<IGroupContext>(GroupContext);
    const {socket} = useContext<ISocketContext>(SocketContext);

    return (
        <div className={props.className}>
            {props.searched ?
                props.searchItems.map((item, index) =>
                    (
                        <SearchItem
                            key={`searchItem-${index}`}
                            posterSrc={item.itemData.posterSrc}
                            title={item.itemData.title}
                            onAdd={() => {
                                // Clear search input
                                const searchInput = document
                                    .getElementById('searchInput') as HTMLInputElement;
                                searchInput.value = '';

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