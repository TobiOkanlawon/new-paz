"use client";
import React from "react";
import Image from "next/image";
import styles from "./backContainer.module.css";
import { useRouter } from "next/navigation";

const Back = () => {
  const router = useRouter();
  return (
    <div className={styles.backContainer}>
      <button
        type="button"
        onClick={() => {
          router.back();
        }}
        className={styles.backButton}
        aria-label="Go back"
      >
        <Image
          src={"/ArrowLeft.png"}
          className={styles.arrowBack}
          width={18}
          height={18}
          alt="Arrow Back"
        />
        <span>Back</span>
      </button>
    </div>
  );
};

export default Back;
