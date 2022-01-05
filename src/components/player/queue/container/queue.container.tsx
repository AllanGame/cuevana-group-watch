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
                            addedBy={item.data.addedBy}
                            duration={item.data.duration}
                            posterSrc={item.data.posterSrc}
                            title={item.data.title}
                        />
                    ))
            }
        </div>
    )
}

export default QueueContainer;