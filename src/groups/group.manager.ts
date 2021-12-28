import User from "../users/user";
import Group from "./group";

export class GroupManager {
    groups: Map<string, Group> = new Map();

    createGroup(groupTitle: string, user: User): Group {
        let group = new Group(this.generateId(), groupTitle, user);
        this.groups.set(group.id, group);
        return group;
    }

    generateId() {
        return Math.random().toString(36).substring(2, 8);
    }
}

// TODO: Find another way to do this, i don't know too much about hooks but check useMemo idk
let groupManager: GroupManager;
export function createGroupManager() {
    if(!groupManager) {
        groupManager = new GroupManager();
    }

    return groupManager;
}