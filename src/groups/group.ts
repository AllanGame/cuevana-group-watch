import Video from "../common/video";
import User from "../users/user";
import {ViewState} from "../common/types";

export default class Group {
    id: string;
    title: string;
    members: User[] = []
    // TODO: remove queue property, use viewState.queue
    queue: Video[] = [];
    viewState: ViewState;

    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;

        // Initial view state
        this.viewState = {time: 0, playing: false, groupId: id, queue: []};
    }
}