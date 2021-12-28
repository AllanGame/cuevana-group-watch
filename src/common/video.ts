import User from "../users/user";

export default class Video {
    addedBy: User;
    origin: string;

    constructor(addedBy: User, origin: string) {
        this.addedBy = addedBy;
        this.origin = origin;
    }
}