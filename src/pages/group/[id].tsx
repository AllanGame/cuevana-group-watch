import { NextPage, NextPageContext } from "next";
import Button from "../../components/ui/button";
import Player from "../../components/player/player";
import styles from '../../styles/Group.module.css'
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../users/user.context";
import {GroupContext, IGroupContext} from "../../groups/group.context";
import Group from "../../groups/group";


const GroupPage: NextPage = (props: any) => {
    const [group, setGroup] = useState<Group>(props.group);
    const {user} = useContext(UserContext) as any;

    useEffect(() => {
        if(props.group.error || !user || !user[0]) {
            return;
        }

        fetch('/api/socketio');
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

    return (
        <GroupContext.Provider value={{group, setGroup} as IGroupContext}>
            <div className={styles.container}>
                <Player group={props.group} viewer={user[0]}/>
                <div className={styles.debug}>
                    <p>DEBUG not finished</p>
                </div>
            </div>
        </GroupContext.Provider>
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