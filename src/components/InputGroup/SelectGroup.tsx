import React from "react";
import styles from "./InputGroup.module.css";

type Props = {
  label: string;
  placeholder: string;
  name?: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectGroup = ({
  label,
  name,
  options,
  placeholder,
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
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectGroup;
