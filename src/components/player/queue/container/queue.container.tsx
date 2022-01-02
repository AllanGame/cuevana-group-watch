import type {NextPage} from "next";
import QueueItem from "../item/queue.item";
import Video from "../../../../common/video";

interface Props {
    queueItems: Video[]
    className: string;
}

/**
 * Displays the current queue
 */
const QueueContainer: NextPage<Props> = (props): JSX.Element => {
    return (
        <div className={props.className}>
            {
                props.queueItems.map((item: Video, index) =>
                    (
                        <QueueItem
                            key={`searchItem-${index}`}
                            addedBy={item.itemData.addedBy}
                            duration={item.itemData.duration}
                            posterSrc={item.itemData.posterSrc}
                            title={item.itemData.title}
                        />
                    ))
            }
        </div>
    )
}

export default QueueContainer;