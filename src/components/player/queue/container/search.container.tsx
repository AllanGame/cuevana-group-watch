import type {NextPage} from "next";
import SearchItem from "../item/search.item";
import {QueueManagerState, VideoItemData} from "../../../../common/types";
import {Dispatch, SetStateAction, useContext} from "react";
import {QueueContext} from "../../../../groups/queue.context";
import Video from "../../../../common/video";

interface Props {
    searched: boolean;
    searchItems: VideoItemData[];
    queueManagerStateModifier: Dispatch<SetStateAction<QueueManagerState>>;
    queueStateModifier: Dispatch<SetStateAction<any>>;
    className: string;
}

/**
 * Used to show the results
 * when a user is searching for a video
 */
const SearchContainer: NextPage<Props> = (props): JSX.Element => {
    return (
        <div className={props.className}>
            {props.searched ?
                props.searchItems.map((item, index) =>
                    (
                        <SearchItem
                            key={`searchItem-${index}`}
                            posterSrc={item.posterSrc}
                            title={item.title}
                            onAdd={() => {

                                // Clean search input because user isn't searching anymore
                                let searchInput = document.getElementById('searchInput') as any;
                                searchInput.value = '';

                                props.queueManagerStateModifier((queueManagerState) => {
                                    return {
                                        ...queueManagerState,
                                        searching: false,
                                        searched: false,
                                        searchItems: [],
                                        queueItems: queueManagerState.queueItems.concat([{
                                            addedBy: item.addedBy,
                                            duration: item.duration,
                                            posterSrc: item.posterSrc,
                                            title: item.title,
                                            origin: item.origin
                                        }])
                                    }
                                })
                                props.queueStateModifier((queueState: any) => {
                                    return {
                                        videos: queueState.videos.concat([new Video(item.addedBy, item.origin)]),
                                        videosItemData: queueState.videos.concat([{
                                            addedBy: item.addedBy,
                                            duration: item.duration,
                                            posterSrc: item.posterSrc,
                                            title: item.title,
                                            origin: item.origin
                                        }])
                                    }
                                })

                            }}
                        />
                    ))
                :
                <h1>Press enter to search</h1>
            }
        </div>
    )
}

export default SearchContainer;