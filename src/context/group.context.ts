import {createContext, Dispatch, SetStateAction} from "react";
import Group from "../groups/group";

export type IGroupContext = {
    group: Group,
    setGroup: Dispatch<SetStateAction<Group>>
};

export const GroupContext = createContext<IGroupContext>({} as any);