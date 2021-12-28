import Video from "../common/video";
import User from "../users/user";
import Group from "./group";

export class GroupManager {
    currentId: number = 0;
    groups: Map<string, Group> = new Map();

    createGroup(groupTitle: string, user: User): Group {
        let group = new Group(this.generateId(), groupTitle, user);
        group.queue = [new Video(user, "https://cuevana3.io/episodio/hawkeye-1x1")]
        group.currentVideo = group.queue[0];
        this.groups.set(group.id, group);
        return group;
    }

    generateId() {
        return Math.random().toString(36).substring(2, 8);
    }
}

let groupManager: GroupManager;
export function createGroupManager() {
    if(!groupManager) {
        groupManager = new GroupManager();
    }
    return groupManager;
}