import { NextPage } from "next";
import { MouseEventHandler } from "react";
import styles from '../styles/components/Button.module.css';

interface Props {
    type: 'primary' | 'secondary'
    onClick?: MouseEventHandler<HTMLDivElement>
    className?: string;
}

const Button: NextPage<Props> = (props): JSX.Element => { 
    return (
        <div onClick={props.onClick} className={styles[props.type+'ButtonContainer']}>
            <p className={styles[props.type]}>{props.children}</p>
        </div>
    )
}

export default Button;