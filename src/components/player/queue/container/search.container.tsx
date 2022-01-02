import type {NextPage} from "next";
import SearchItem from "../item/search.item";
import {QueueManagerState, VideoItemData} from "../../../../common/types";
import {Dispatch, SetStateAction, useContext} from "react";
import Video from "../../../../common/video";

interface Props {
    searched: boolean;
    searchItems: Video[];
    queueManagerStateModifier: Dispatch<SetStateAction<QueueManagerState>>;
    queueStateModifier: Dispatch<SetStateAction<Video[]>>;
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
                            posterSrc={item.itemData.posterSrc}
                            title={item.itemData.title}
                            onAdd={() => {
                                const searchInput = document
                                    .getElementById('searchInput') as HTMLInputElement;
                                searchInput.value = '';
                                props.queueStateModifier((prevState) => prevState.concat([item]))
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