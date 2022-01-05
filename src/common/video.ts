import {VideoData} from "./types";

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
    origin: string;
    data: VideoData;
    isPlaying: boolean;

    constructor(origin: string, itemData: VideoData, isPlaying: boolean) {
        this.origin = origin;
        this.data = itemData;
        this.isPlaying = isPlaying;
    }
}