import React from "react";
import styles from "./InputGroup.module.css";

type Props = {
  label: string;
  placeholder: string;
  name?: string;
  errors?: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectGroup = ({
  label,
  name,
  options,
  placeholder,
  errors,
  ...selectProps
}: Props) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <select
        className={styles.selectinput}
        name={name}
        id={name}
        {...selectProps}
      >
        <option className={styles.placeholder} value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors && (
        <div className={styles.errorsContainer}>
          <span className={styles.error}>{errors}</span>
        </div>
      )}
    </div>
  );
};

export default SelectGroup;
