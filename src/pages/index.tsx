import type { NextPage } from 'next'
import GroupAccess from '../components/auth/group.access'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
        <GroupAccess create={true}/>
    </div>
 )
}

export default Home
