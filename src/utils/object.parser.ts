import Video from "../common/video";
import Group from "../groups/group";
import User from "../users/user";
import {ViewState} from "../common/types";

interface jsonGroupObject {
    id: string;
    title: string;
    members: User[];
    queue: Video[];
    viewState: ViewState;
}

/**
 * Converts a {@link Group} object to a 
 * {@link jsonGroupObject} object 
 * 
 * @param group The {@link Group} object to convert
 * @returns The converted {@link jsonGroupObject} object
 */
function toJSON({id, title, members, queue, viewState}: Group): jsonGroupObject {
    return {
        id,
        title, 
        members,
        queue,
        viewState
    }
}

/**
 * Converts a {@link jsonGroupObject} object to a {@link Group} 
 * object
 * @param object the Json Object 
 * @returns The converted {@link Group} object
 */
function toGroup({id, title, members, queue, viewState}: jsonGroupObject): Group {
    let newGroup = new Group(id, title);
    newGroup.members = members;
    newGroup.queue = queue;
    newGroup.viewState = viewState;
    return newGroup;
}

export {
    toJSON,
    toGroup
};

export type { jsonGroupObject };
