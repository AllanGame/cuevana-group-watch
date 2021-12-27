import { NextPage, NextPageContext } from "next";
import Player from "../../components/player";
import styles from '../../styles/Group.module.css'
import { toGroup } from "../../utils/object.parser";

const Group: NextPage = (props: any) => {    
    if(props.group.error) {
        return (
            <div>
                <h1>Cannot find that group.</h1>
            </div>
        )
    }

    let group = toGroup(props.group);

    return (
        <div className={styles.container}>
            <h1>Welcome to <em>{group.title}</em></h1>
            {/* <p>ID: {group.id}</p> */}
            <Player group={group} viewer={group.reference}></Player>
        </div>
    )
}

export async function getServerSideProps(context: NextPageContext) {
    const res = await fetch("http://localhost:3000/api/groups/" + context.query.id);
    const group = await res.json();

    return {
      props: {
        group
      },
    };
}

export default Group;