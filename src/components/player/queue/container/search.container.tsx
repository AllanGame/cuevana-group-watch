import type {NextPage} from "next";
import SearchItem from "../item/search.item";
import {QueueManagerState, VideoItemData} from "../../../../common/types";
import {Dispatch, SetStateAction} from "react";

interface Props {
    searched: boolean;
    searchItems: VideoItemData[];
    stateModifier: Dispatch<SetStateAction<QueueManagerState>>;
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
                                props.stateModifier((queueManagerState) => {
                                    return {
                                        ...queueManagerState,
                                        searching: false,
                                        searched: false,
                                        searchItems: [],
                                        queueItems: queueManagerState.queueItems.concat([{
                                            addedBy: item.addedBy,
                                            duration: item.duration,
                                            posterSrc: item.posterSrc,
                                            title: item.title
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