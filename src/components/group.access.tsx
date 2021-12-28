import { NextPage } from "next";
import Button from "./button";
import styles from '../styles/components/group.access.module.css';
import { useRouter } from "next/router";
import {useContext} from "react";
import {UserContext} from "../users/user.context";

interface Props {
    create: boolean;
}

const GroupAccess: NextPage<Props> = (props): JSX.Element => {
    const {user, setUser} = useContext(UserContext) as any;
    const { push } = useRouter()
    async function createGroupHandler() {
        const nicknameInput = document.getElementById('nickname') as any;
        const groupTitleInput = document.getElementById('title') as any;
        
        if(!nicknameInput.value || !groupTitleInput.value) {
            alert('Nickname and group title are required.')
            return;
        }
        
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/groups`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  nickname:  nicknameInput.value,
                  title: groupTitleInput.value
              }),
            }).then(response => {
              return response.json()
            }).then(data => {
                setUser([{currentTime: 0, paused: false, nickname: nicknameInput.value}])
              push('/group/'+data.id)
            })
          } catch (error) {
            alert('something went wrong, check console.')
            console.error(error);
          }
          
    }

    function changeToJoinGroup() {
        alert('This operation is not supported yet.')
    }

    if(props.create) {
        return (
            <div className={styles.createGroupContainer}>
                <h1 className={styles.title}>Create your group</h1>

                <div className={styles.textInputs}>
                    <div className={styles.nicknameInputContainer}>
                        <p className={styles.inputIndicator}>Your nickname</p>
                        <input className={styles.input} type="text" name="nickname" id="nickname" />
                    </div>

                    <div className={styles.groupTitleInputContainer}>
                        <p className={styles.inputIndicator}>Group Title</p>
                        <input className={styles.input} type="text" name="title" id="title" />
                    </div>
                </div>

                {/* <div className={styles.permissionContainer}>
                    <div className={styles.permission}>
                        <p className={styles.permissionName}>Only you can modify the content</p>
                        <p className={styles.permissionName}>Only you can add videos to the queue</p>
                    </div>
                </div> */}

                <div className={styles.cta}>
                    <div className={styles.joinGroupBtn}>
                        <Button onClick={changeToJoinGroup} type="secondary">Or join group</Button>
                    </div>
                    <div className={styles.createGroupBtn}>
                        <Button onClick={createGroupHandler} type="primary">Next</Button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default GroupAccess;