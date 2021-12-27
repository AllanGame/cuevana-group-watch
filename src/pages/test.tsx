import type { NextPage } from 'next'
import Video from '../common/video'
import QueueManager from '../components/queue.manager'
import Group from '../groups/group'
import styles from '../styles/Test.module.css'
import User from '../users/user'

const Test: NextPage = () => {

  let user = new User('alam');
  const group = new Group("sexo", "si", user);
  group.queue = [new Video('https://cdn.discordapp.com/attachments/804498423671029771/921606158106636298/TROLEADOR_CARA.mp4', user, 'https://cuevana3.io/episodio/hawkeye-1x1')]
  
  return (
    <div className={styles.container}>
    </div>

)
}

export default Test
