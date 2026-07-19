import React, { useRef } from "react";
import styles from "./DocumentUpload.module.css";
import { LuUpload, LuLoaderCircle, LuCircleCheck } from "react-icons/lu";

type Props = {
  label: string;
  onFileChange?: (file: File | null, error?: string) => void;
  fileName?: string;
  error?: string;
  uploading?: boolean;
  uploaded?: boolean;
};

const DocumentUpload = ({
  label,
  onFileChange,
  fileName,
  error,
  uploading,
  uploaded,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
  const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      onFileChange?.(null, `${label} must be a PDF, JPG, or PNG file`);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      onFileChange?.(null, `${label} must be 5MB or smaller`);
      e.target.value = "";
      return;
    }

    onFileChange?.(file, "");
    e.target.value = "";
  };

  const statusText = uploading
    ? "Uploading…"
    : fileName || "Click to upload";

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      <div
        className={styles.uploadArea}
        onClick={() => !uploading && inputRef.current?.click()}
        style={uploading ? { cursor: "wait", opacity: 0.7 } : undefined}
      >
        {uploading ? (
          <LuLoaderCircle size={20} color="#214ccf" className={styles.spinning} />
        ) : uploaded ? (
          <LuCircleCheck size={20} color="#17A842" />
        ) : (
          <LuUpload size={20} color="#878787" />
        )}
        <span className={styles.uploadText}>{statusText}</span>
        {uploaded && !uploading && (
          <span className={styles.uploadedTag}>Uploaded</span>
        )}
        <span className={styles.hint}>PDF, JPG, PNG (Max 5MB)</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          hidden
          disabled={uploading}
          onChange={handleChange}
        />
      </div>
      {error && (
        <p style={{ color: "#d32f2f", fontSize: "12px", marginTop: "6px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default DocumentUpload;
