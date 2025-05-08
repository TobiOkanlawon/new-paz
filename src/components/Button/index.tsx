import React, { lazy } from "react";
import styles  from "./button.module.css";
import clsx from "clsx";

type Props = {
    label?: string;
} & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

const Button = ({ className, type = "button", ...rest }: Props) => {
    return (
        <button type={type} className={clsx(styles.button)} {...rest}>
            {rest.children || rest.label}
        </button>
    );
}
export default Button;