export default class User {
    nickname: string;
    currentTime: number = 0;
    paused: boolean = false;

    constructor(nickname: string) {
        this.nickname = nickname;
    }
}