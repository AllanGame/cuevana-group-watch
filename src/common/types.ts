import User from "../users/user";

// TODO: Start with isSomething boolean names

export type ViewState = {
    time: number;
    playing: boolean;
    groupId: string;
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
    origin: string;
}


export type QueueManagerState = {
    searching: boolean;
    searched: boolean;
    searchItems: VideoItemData[];
    queueItems: VideoItemData[];
}