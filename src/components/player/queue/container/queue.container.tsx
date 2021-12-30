import type {NextPage} from "next";
import QueueItem from "../item/queue.item";

interface Props {
    queueItems: object[]
    className: string;
}

/**
 * Displays the current queue
 */
const QueueContainer: NextPage<Props> = (props): JSX.Element => {
    return (
        <div className={props.className}>
            {
                props.queueItems.map((item: any) =>
                    (
                        <QueueItem
                            addedBy={item.addedBy}
                            duration={item.duration}
                            posterSrc={item.posterSrc}
                            title={item.title}
                        />
                    ))
            }
        </div>
    )
}

export default QueueContainer;