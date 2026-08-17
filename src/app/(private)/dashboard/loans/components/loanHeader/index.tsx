import React from 'react'
import style from './header.module.css'
import Button from '@/components/Button'

interface LoanHeaderProps {
  title: string;
  desc: string;
  buttonText?: string;
  buttonAction?: VoidFunction;
  secondaryButtonText?: string;
  secondaryButtonAction?: VoidFunction;
}

const LoanHeader = ({
  title,
  desc,
  buttonText,
  buttonAction,
  secondaryButtonText,
  secondaryButtonAction,
}: LoanHeaderProps) => {
  return (
    <div className={style.container}>
      <div className={style.textContainer}>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <div className={style.buttonContainer}>
        {secondaryButtonText && (
          <Button variant="outlined2" onClick={secondaryButtonAction}>
            {secondaryButtonText}
          </Button>
        )}
        {buttonText && (
          <Button onClick={buttonAction}>{buttonText}</Button>
        )}
      </div>
    </div>
  );
};

export default LoanHeader