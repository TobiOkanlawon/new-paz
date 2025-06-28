import React, { lazy } from "react";
import styles  from "./button.module.css";
import clsx from "clsx";
import { LuLoaderCircle } from "react-icons/lu";

type Props = {
    label?: string;
    loading?: boolean;
} & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

const Button = ({ className, type = "button", loading = false, disabled, ...rest }: Props) => {
    return (
        <button type={type} className={clsx(styles.button, className, {
            [styles.disabled]: disabled || loading,
        })}
        disabled={disabled||loading}
        {...rest}>
            {loading ? <LuLoaderCircle className={styles.spinner} /> : rest.children || rest.label}
        </button>
    );
}
export default Button;