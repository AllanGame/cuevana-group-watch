import { NextPage, NextPageContext } from "next";
import Button from "../../components/ui/button";
import Player from "../../components/player/player";
import styles from '../../styles/Group.module.css'
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../users/user.context";
import {GroupContext} from "../../groups/group.context";

const GroupPage: NextPage = (props: any) => {
    const {group, setGroup} = useContext(GroupContext) as any;
    const {user} = useContext(UserContext) as any;

    useEffect(() => {
        if(props.group.error || !user || !user[0]) {
            return;
        }
        fetch('/api/socketio').finally(() => {
            setGroup(props.group.error ? null : props.group);
        })

    }, [])

    if(props.group.error) {
        return (
            <div className={styles.notFound}>
                <h1>Cannot find that group.</h1>
                <Button type="primary" href="/">Go back</Button>
            </div>
        )
    }
    if(!user) {
        return (
            <div className={styles.notFound}>
                <h1>You haven&apos;t registered yet.</h1>
                <Button type="primary" href="/">Go back</Button>
            </div>
        )
    }
    if(!group) {
        return (
            <div className={styles.notFound}>

            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Player group={group} viewer={user[0]}/>
            <div className={styles.debug}>
                <p>origin: {group.currentVideo ? group.currentVideo.origin : 'n/p'}</p>
                <p>your nickname: {user[0].nickname}</p>
                <p>{group.currentVideo ? 'video-source' : 'no source'}</p>
                <p>group-title: {group.title}</p>
                <p>member-count: {JSON.stringify(group.members)}</p>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: NextPageContext) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/groups/${context.query.id}`);
    const group = await res.json();

    return {
      props: {
        group
      },
    };
}

export default GroupPage;