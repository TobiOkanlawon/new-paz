import React, { useState } from 'react';
import styles from './toggleSwitch.module.css';
import Modal from '../Modal';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => {
  const [isActive, setIsActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only show modal if we're turning it ON
    if (!checked && e.target.checked) {
      setIsActive(true);
    } else {
      onChange(false); // Instant off
    }
  };

  const handleModalContinue = () => {
    setIsActive(false);
    onChange(true); // Confirm switch ON
  };

  return (
    <>
      <div className={styles.switchContainer}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleInputChange}
            className={styles.switchInput}
          />
          <span className={styles.switchSlider}></span>
        </label>
        {label && <span className={styles.switchLabel}>{label}</span>}
      </div>

      {isActive && (
        <Modal isOpen={isActive} onClose={() => setIsActive(false)}>
          <div className={styles.modalContainer}>
            <h2>Lock your savings</h2>
            <p>
              By toggling this option, it means that you cannot have direct withdrawal privilege on your savings balance.
              In the case of an emergency withdrawal you would either pay a penalty of N2,000 or wait for 24 hours before having access to your funds.
            </p>
            <button onClick={handleModalContinue}>Continue</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ToggleSwitch;
