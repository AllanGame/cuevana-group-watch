import { NextPage } from "next";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import styles from '../styles/components/Button.module.css';

interface Props {
    type: 'primary' | 'secondary'
    onClick?: MouseEventHandler<HTMLDivElement>
    className?: string;
    href?: string;
}

/**
 * Custom button
 * You can use the href property or a custom 
 * function to handle user click
 * 
 * @param props Properties of this element
 * @returns Element
 */
const Button: NextPage<Props> = (props): JSX.Element => { 

    const {push} = useRouter();

    function hrefHandler() {
        push(props.href || "/");
    }

    return (
        <div onClick={props.onClick ? props.onClick : hrefHandler} className={styles[props.type+'ButtonContainer']}>
            <p className={styles[props.type]}>{props.children}</p>
        </div>
    )
}

export default Button;