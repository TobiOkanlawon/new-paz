"use client";
import { useState } from "react";
import styles from "./FileUploader.module.css";

const FileUploader = () => {
  const [fileName, setFileName] = useState(
    "Account statement of the last 6 months"
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "Account statement of the last 6 months");
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor="fileUpload" className={styles.label}>
        Account Statement
      </label>

      <div className={styles.inputBox}>
        <span className={styles.placeholder}>{fileName}</span>
        <label htmlFor="fileUpload" className={styles.browseButton}>
          Browse
        </label>
        <input
          type="file"
          id="fileUpload"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUploader;
