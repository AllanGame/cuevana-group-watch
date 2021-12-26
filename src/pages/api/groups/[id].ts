import type { NextApiRequest, NextApiResponse } from 'next'
import { createGroupManager } from '../../../groups/group.manager';
import { toGroup } from '../../../utils/object.parser';

type Data = {}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, query: {id}, body } = req;
  
  let groupManager = createGroupManager()
  let group = groupManager.groups.get(id as string)

  switch(method) {
    case "GET":
      if(!group) return res.status(404).json({error: 'Group not found.'})
      return res.status(200).json(group);
      
    case "PUT":
      if(!group) return res.status(404).json({error: 'Group not found.'})

      body.id = group.id;
      group = toGroup(body);
   
      return res.status(200).json(group);
    default:
      return res.status(500).json({error: "Unsupported operation"})
  }
}
