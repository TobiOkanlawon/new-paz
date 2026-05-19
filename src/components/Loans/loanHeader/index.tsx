import React from 'react'
import style from './header.module.css'
import Button from '@/components/Button'

interface LoanHeaderProps {
  title: string;
  desc: string;
  buttonText?: string;
  buttonAction?: VoidFunction;
}

const LoanHeader = ({ title, desc, buttonText, buttonAction }: LoanHeaderProps) => {
  return (
    <div className={style.container}>
      <div className={style.textContainer}>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <div className={style.buttonContainer}>
        {buttonText && (
          <Button onClick={buttonAction}>{buttonText}</Button>
        )}
      </div>
    </div>
  );
};

export default LoanHeader