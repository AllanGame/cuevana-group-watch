import User from "../users/user";

export default class Video {
    src: string;
    addedBy: User;
    origin: string;

    constructor(src: string, addedBy: User, origin: string) {
        this.src = src;
        this.addedBy = addedBy;
        this.origin = origin;
    }
}