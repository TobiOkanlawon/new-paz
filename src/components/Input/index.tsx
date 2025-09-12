import styles from "./input.module.css";
import clsx from "clsx";

type Props = {
  label: string;
  errors?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = ({ label, id, className, errors, ...rest }: Props) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={clsx(styles.input, className, errors && styles.errorInput)}
        {...rest}
      />
      {errors && (
        <div className={styles.errorsContainer}>
          <span className={styles.error}>{errors}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
