import {NextApiRequest, NextApiResponse} from "next";
import { Server } from 'socket.io'
import Group from "../../groups/group";

const roomsCache: Map<string, Group> = new Map();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // @ts-ignore
    if (!res.socket.server.io) {

        // @ts-ignore
        const io = new Server(res.socket.server)

        io.on('connection', socket => {
            socket.on('joinRoom', ({group, user}) => {
                socket.join(group.id)
                socket.broadcast.to(group.id).emit('userJoin', user);

                // Send room current group state to new user (if exists)
                if(roomsCache.has(group.id)) {
                    socket.emit('groupUpdate', roomsCache.get(group.id));
                }
            })

            socket.on('groupUpdate', (group: Group) => {
                socket.broadcast.to(group.id).emit("groupUpdate", group);
                roomsCache.set(group.id, group);
            })

            socket.on('timeUpdate', (data) => {
                const group = roomsCache.get(data.group);
                if(group) {
                    // Update to the latest time for new users
                    group.viewState.time = data.time;
                }
            })
        })

        // @ts-ignore
        res.socket.server.io = io
    }
    res.end()
}