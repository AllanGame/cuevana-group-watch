import Video from "../common/video";
import User from "../users/user";

export default class Group {
    id: string;
    title: string;
    members: User[] = []
    reference: User;
    queue: Video[] = [];
    currentVideo: Video | null = null;
    currentTime: number = 0;
    playing: boolean = false;

    constructor(id: string, title: string, reference: User) {
        this.id = id;
        this.title = title;
        this.reference = reference;
        this.members.push(reference);
    }
}