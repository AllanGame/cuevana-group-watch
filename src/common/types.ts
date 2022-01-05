import User from "../users/user";
import Video from "./video";

// TODO: Start with isSomething boolean names

export type ViewState = {
    time: number;
    playing: boolean;
    groupId: string;
    queue: Video[];
}

export type LocalViewConfig = {
    fullscreen: boolean;
    volume: number;
}

export type VideoData = {
    addedBy: User;
    duration: string;
    posterSrc: string;
    title: string;
    origin: string;
    /**
     * Saves the URL of the real video of the movie / series
     */
    src?: string;
}


export type QueueManagerState = {
    searching: boolean;
    searched: boolean;
    searchItems: Video[];
    queueItems: Video[];
}