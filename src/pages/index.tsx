import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import GroupAccess from '../components/group.access'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <GroupAccess create={true}></GroupAccess>
    </div>
  )
}

export default Home
