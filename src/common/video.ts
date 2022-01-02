import User from "../users/user";
import {VideoItemData} from "./types";

/**
 * Video class used in {@link Group.queue}
 *
 * Contains who added this video to the
 * queue and what is the origin (Cuevana URL)
 *
 * Used by `/api/cuevana` to obtain the real video
 * of an origin.
 */
export default class Video {
    // TODO: add isPlaying property
    origin: string;
    itemData: VideoItemData;

    constructor(origin: string, itemData: VideoItemData) {
        this.origin = origin;
        this.itemData = itemData;
    }
}