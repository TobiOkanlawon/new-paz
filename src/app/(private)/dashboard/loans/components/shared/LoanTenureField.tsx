import React, { useState } from "react";
import LoanSelect from "./LoanSelect";
import LoanInput from "./LoanInput";

const OTHERS_OPTION = "Others";

type Props = {
  label?: string;
  options: string[];
  maxTenorDays?: number;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  placeholder?: string;
  error?: string;
};

// Adds an "Others" option to the preset tenure list so users can manually
// enter a day count, capped at the product's max Tenor when known.
const LoanTenureField = ({
  label = "Loan Tenure",
  options,
  maxTenorDays,
  value,
  onChange,
  onBlur,
  placeholder = "Select a loan tenure",
  error,
}: Props) => {
  const [isCustom, setIsCustom] = useState(value !== "" && !options.includes(value));

  const selectOptions = [...options, OTHERS_OPTION];
  const selectValue = isCustom ? OTHERS_OPTION : value;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;

    if (selected === OTHERS_OPTION) {
      setIsCustom(true);
      onChange("");
      return;
    }

    setIsCustom(false);
    onChange(selected);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");

    if (maxTenorDays && digits && Number(digits) > maxTenorDays) {
      digits = String(maxTenorDays);
    }

    onChange(digits);
  };

  return (
    <>
      <LoanSelect
        label={label}
        options={selectOptions}
        value={selectValue}
        onChange={handleSelectChange}
        onBlur={onBlur}
        placeholder={placeholder}
        error={isCustom ? undefined : error}
      />
      {isCustom && (
        <LoanInput
          label={maxTenorDays ? `Custom Tenure (max ${maxTenorDays} days)` : "Custom Tenure (days)"}
          placeholder="Enter number of days"
          inputMode="numeric"
          value={value}
          onChange={handleCustomChange}
          onBlur={onBlur}
          error={error}
        />
      )}
    </>
  );
};

export default LoanTenureField;
