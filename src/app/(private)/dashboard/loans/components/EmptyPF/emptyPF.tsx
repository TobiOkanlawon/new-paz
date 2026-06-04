import React from "react";
import Button from "@/components/Button";
import LoanHeader from "../loanHeader";
import Image from "next/image";
import styles from "./emptyPF.module.css";

const EmptyPF = () => {
  return (
    <div className={styles.container}>
      <LoanHeader
        title="Project Finance"
        desc="We fund your projects and grow with you"
      />
      <div className={styles.contentContainer}>
        <Image
          src={"/images/pfEmptyImage.png"}
          alt="Project Finance Empty Image"
          width={300}
          height={300}
        />
        <h4>Get a Project Partnership Finance</h4>
        <p>
          Our partnership model is designed to help your business grow without
          the burden of traditional loans. With no hidden charges or fees and
          Profit ratio agreed upon.
        </p>
        <div className={styles.buttonContainer}>
          <Button variant="primary">Start Application</Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyPF;
