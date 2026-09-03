"use client";
import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import Button from "@/components/Button";
import styles from "./terms.module.css";

const TosBackButton = () => {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outlined"
      className={styles.backButton}
      onClick={() => router.back()}
    >
      <LuArrowLeft /> Back
    </Button>
  );
};

export default TosBackButton;
