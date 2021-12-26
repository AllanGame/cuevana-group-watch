import Video from "../common/video";
import Group from "../groups/group";
import User from "../users/user";

interface jsonGroupObject {
    id: string;
    title: string;
    members: User[];
    reference: User;
    queue: Video[];
    currentVideo: Video | null;
    currentTime: number; 
    playing: boolean;
}

/**
 * Converts a {@link Group} object to a 
 * {@link jsonGroupObject} object 
 * 
 * @param group The {@link Group} object to convert
 * @returns The converted {@link jsonGroupObject} object
 */
function toJSON({id, title, members, reference, queue, currentVideo, currentTime, playing}: Group): jsonGroupObject {
    return {
        id,
        title, 
        members,
        reference,
        queue,
        currentTime,
        currentVideo,
        playing
    }
}

/**
 * Converts a {@link jsonGroupObject} object to a {@link Group} 
 * object
 * @param object the Json Object 
 * @returns The converted {@link Group} object
 */
function toGroup({id, title, members, reference, queue, currentVideo, currentTime, playing}: jsonGroupObject): Group {
    let newGroup = new Group(id, title, reference);
    newGroup.members = members;
    newGroup.queue = queue;
    newGroup.currentTime = currentTime;
    newGroup.currentVideo = currentVideo;
    newGroup.playing = playing;
    return newGroup;
}

export {
    toJSON,
    toGroup
};

export type { jsonGroupObject };
