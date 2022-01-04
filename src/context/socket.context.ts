import {createContext, Dispatch, SetStateAction} from "react";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";

export type ISocketContext = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    setSocket: Dispatch<SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap>>>
};

export const SocketContext = createContext<ISocketContext>({} as any);