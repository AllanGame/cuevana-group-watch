import type {NextPage} from "next";
import SearchItem from "../item/search.item";

interface Props {
    searched: boolean;
    searchItems: object[];
    stateModifier: any;
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
                props.searchItems.map((item: any) =>
                    (
                        <SearchItem
                            posterSrc={item.posterSrc}
                            title={item.title}
                            onAdd={() => {
                                props.stateModifier((queueContainerState: any) => {
                                    return {
                                        ...queueContainerState,
                                        searching: false,
                                        searched: false,
                                        queueItems: queueContainerState.queueItems.concat([{
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