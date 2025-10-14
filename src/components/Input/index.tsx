import styles from "./input.module.css";
import clsx from "clsx";
import { useState } from "react";
// import Image from "next/image";
import { LuEye, LuEyeClosed } from "react-icons/lu";

type Props = {
  label: string;
  errors?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const   Input = ({ label, id, className, errors, type, ...rest }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={clsx(
            styles.input,
            className,
            errors && styles.errorInput,
            isPassword && styles.passwordInput
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {
              showPassword ? (
                <LuEye/>
              ) : (
                <LuEyeClosed/>
              )
            }
            {/* <Image
              src={showPassword ? "/eyeOff.png" : "/eyeOff2.png"}
              alt="Toggle password visibility"
              width={20}
              height={20}
            /> */}
          </button>
        )}
      </div>
      {errors && (
        <div className={styles.errorsContainer}>
          <span className={styles.error}>{errors}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
