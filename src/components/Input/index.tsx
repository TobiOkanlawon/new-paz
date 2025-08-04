import styles from "./input.module.css";
import clsx from "clsx";

type Props = {
  label: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = ({ label, id, className, ...rest }: Props) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input id={id} className={clsx(styles.input, className)} {...rest} />
    </div>
  );
};

export default Input;
