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

export type VideoItemData = {
    addedBy: User;
    duration: string;
    posterSrc: string;
    title: string;
    origin: string;
}


export type QueueManagerState = {
    searching: boolean;
    searched: boolean;
    searchItems: Video[];
    queueItems: Video[];
}