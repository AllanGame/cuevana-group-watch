import { NextPage, NextPageContext } from "next";
import Button from "../../components/button";
import Player from "../../components/player";
import styles from '../../styles/Group.module.css'
import { toGroup } from "../../utils/object.parser";

const Group: NextPage = (props: any) => {    

    if(props.group.error) {
        return (
            <div className={styles.notFound}>
                <h1>Cannot find that group.</h1>
                <Button type="primary" href="/">Go back</Button>
            </div>
        )
    }

    let group = toGroup(props.group);

    return (
        <div className={styles.container}>
            <Player group={group} viewer={group.reference}></Player>
            <div className={styles.debug}>
                <p>origin: {group.currentVideo ? group.currentVideo.origin : 'n/p'}</p>
                <p>{group.currentVideo ? 'video-source' : 'no source'}</p>
                <p>group-title: {group.title}</p>
                <p>member-count: {group.members.length}</p>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: NextPageContext) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH}/api/groups/${context.query.id}`);
    const group = await res.json();

    return {
      props: {
        group
      },
    };
}

export default Group;