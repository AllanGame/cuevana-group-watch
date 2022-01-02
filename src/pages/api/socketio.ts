import {NextApiRequest, NextApiResponse} from "next";
import { Server } from 'socket.io'
import Group from "../../groups/group";

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
                console.log(`${user.nickname} has joined to ${group.id} room`)
                socket.join(group.id)
                socket.broadcast.to(group.id).emit('groupUpdate', group);
                socket.broadcast.to(group.id).emit('userJoin', user);
            })

            socket.on('viewUpdate', (viewState) => {
                socket.broadcast.to(viewState.groupId).emit('viewUpdate', viewState);
            })

            socket.on('groupUpdate', (newGroup: Group) => {
                console.log('Group Update received', newGroup);
                socket.broadcast.to(newGroup.id).emit("groupUpdate", newGroup);
            })
        })

        // @ts-ignore
        res.socket.server.io = io
    }
    res.end()
}