import { NextPage } from "next";
import Button from "../ui/button";
import styles from '../../styles/components/group.access.module.css';
import { useRouter } from "next/router";
import {useContext, useState} from "react";
import {UserContext} from "../../users/user.context";
import {toGroup, toJSON} from "../../utils/object.parser";
import User from "../../users/user";

interface Props {
    create: boolean;
}


// TODO: this never adds the creator of the group to the group.
const GroupAccess: NextPage<Props> = (props): JSX.Element => {
    const { setUser } = useContext(UserContext) as any;
    const { push } = useRouter()

    const [create, setCreate] = useState(props.create);
    function toggleType() {
        setCreate(!create);
    }

    async function createGroupHandler() {
        const nicknameInput = document.getElementById('nickname') as any;
        const groupTitleInput = document.getElementById('title') as any;
        
        if(!nicknameInput.value || !groupTitleInput.value) {
            alert('Nickname and group title are required.')
            return;
        }

        const user = new User(nicknameInput.value);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/groups`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  title: groupTitleInput.value,
                  // Adds the user to the group
                  creator: user
              }),
            }).then(response => {
              return response.json()
            }).then(data => {
                setUser([user])
              push('/group/'+data.id)
            })
          } catch (error) {
            alert('something went wrong, check console.')
            console.error(error);
          }
          
    }
    async function joinGroupHandler() {
        const nicknameInput = document.getElementById('nickname') as any;
        const groupIdInput = document.getElementById('id') as any;

        if(!nicknameInput.value || !groupIdInput.value) {
            alert('Nickname and group ID are required.')
            return;
        }

        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/groups/${groupIdInput.value}`)
                .then(response => {
                return response.json()
                })
                .then(async (data) => {
                    if(data.error) {
                        alert('Group not found.')
                        return;
                    }
                    let group = toGroup(data);
                    if(group.members.some(member => member.nickname === nicknameInput.value)) {
                        alert('Invalid nickname, a user has already this nickname')
                        return;
                    }
                    let user = new User(nicknameInput.value);
                    group.members.push(user);
                    setUser([{currentTime: 0, paused: false, nickname: user.nickname}])

                    await fetch(`${process.env.NEXT_PUBLIC_SERVER_PATH || 'http://localhost:3000'}/api/groups/${groupIdInput.value}`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(toJSON(group))
                    }).then(res => res.json())
                        .then(data => {
                            push('/group/'+data.id)
                        })
            })
        } catch (error) {
            alert('something went wrong, check console.')
            console.error(error);
        }
    }
    if(create) {
        return (
            <div className={styles.createGroupContainer}>
                <h1 className={styles.title}>Create your group</h1>

                <div className={styles.textInputs}>
                    <div className={styles.nicknameInputContainer}>
                        <p className={styles.inputIndicator}>Your nickname</p>
                        <input className={styles.input} type="text" name="nickname" id="nickname" placeholder="xXProGamer68Xx"/>
                    </div>

                    <div className={styles.groupTitleInputContainer}>
                        <p className={styles.inputIndicator}>Group Title</p>
                        <input className={styles.input} type="text" name="title" id="title" placeholder="Scary movies!"/>
                    </div>
                </div>


                <div className={styles.cta}>
                    <div className={styles.joinGroupBtn}>
                        <Button onClick={toggleType} type="secondary">Or join group</Button>
                    </div>
                    <div className={styles.createGroupBtn}>
                        <Button onClick={createGroupHandler} type="primary">Next</Button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.joinGroupContainer}>
                <h1 className={styles.title}>Join group</h1>

                <div className={styles.textInputs}>
                    <div className={styles.nicknameInputContainer}>
                        <p className={styles.inputIndicator}>Your nickname</p>
                        <input className={styles.input} type="text" name="nickname" id="nickname" placeholder="xXProGamer68Xx"/>
                    </div>

                    <div className={styles.groupTitleInputContainer}>
                        <p className={styles.inputIndicator}>Group ID</p>
                        <input className={styles.input} type="text" name="id" id="id" placeholder="h871y7"/>
                    </div>
                </div>


                <div className={styles.cta}>
                    <div className={styles.joinGroupBtn}>
                        <Button onClick={toggleType} type="secondary">Or create group</Button>
                    </div>
                    <div className={styles.createGroupBtn}>
                        <Button onClick={joinGroupHandler} type="primary">Next</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default GroupAccess;