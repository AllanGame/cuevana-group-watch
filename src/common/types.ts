import User from "../users/user";

export type ViewState = {
    time: number;
    playing: boolean;
    groupId: string;
    user: User;
}

export type LocalViewState = {
    fullscreen: boolean;
    volume: number;
}

export type VideoItemData = {
    addedBy: User;
    duration: string;
    posterSrc: string;
    title: string;
}


export type QueueManagerState = {
    searching: boolean;
    searched: boolean;
    searchItems: VideoItemData[];
    queueItems: VideoItemData[];
}