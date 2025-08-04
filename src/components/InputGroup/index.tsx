import React from 'react';
import styles from './InputGroup.module.css';

type Props = {
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputGroup = ({ label, placeholder, icon, ...inputProps }: Props) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          placeholder={placeholder}
          {...inputProps}
        />
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
    </div>
  );
};

export default InputGroup;
