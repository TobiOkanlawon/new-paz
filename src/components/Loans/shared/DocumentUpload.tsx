import React, { useRef } from "react";
import styles from "./DocumentUpload.module.css";
import { LuUpload } from "react-icons/lu";

type Props = {
  label: string;
  onFileChange?: (file: File) => void;
  fileName?: string;
};

const DocumentUpload = ({ label, onFileChange, fileName }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileChange) onFileChange(file);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      <div className={styles.uploadArea} onClick={() => inputRef.current?.click()}>
        <LuUpload size={20} color="#878787" />
        <span className={styles.uploadText}>
          {fileName || "Click to upload"}
        </span>
        <span className={styles.hint}>PDF, JPG, PNG (Max 5MB)</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.png"
          hidden
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default DocumentUpload;