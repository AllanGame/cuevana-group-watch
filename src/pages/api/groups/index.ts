import type { NextApiRequest, NextApiResponse } from 'next'
import Group from '../../../groups/group';
import { createGroupManager } from '../../../groups/group.manager'
import User from '../../../users/user';

type Data = {
    
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    let groupManager = createGroupManager();
    const { method, body: {nickname, title} } = req;

    switch(method) {
        case "GET":
            return res.status(200).json(Array.from(groupManager.groups.values()));
        case "POST":
            let createdGroup = groupManager.createGroup(title);
            return res.status(200).json(createdGroup);
        default:
            return res.status(200).json([])
    }
  
}
