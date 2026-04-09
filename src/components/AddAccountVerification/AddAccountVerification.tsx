"use client";

import React, { useState } from "react";
import styles from "./addaccountverification.module.css";

import StepIndicator from "./comps/StepIndicator";
import OverviewStep from "./comps/OverviewStep";
import InfoStep from "./comps/InfoStep";
import EnterStep from "./comps/EnterStep";
import SuccessStep from "./comps/SuccessStep";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Step = "overview" | "info" | "enter" | "success";

export default function AddAccountVerification() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("overview");
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const stepToNum: Record<Step, number> = {
    overview: 1,
    info: 2,
    enter: 2,
    success: 3,
  };

  const navigate = (next: Step, dir: "forward" | "back" = "forward") => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 300);
  };

  const contentClass = `${styles.contentWrap} ${
    animating
      ? direction === "forward"
        ? styles.slideOutLeft
        : styles.slideOutRight
      : direction === "forward"
        ? styles.slideInRight
        : styles.slideInLeft
  }`;

  if (step === "success") {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={contentClass}>
            <SuccessStep
              title="Add Primary Account"
              text="Your account has been added successfully"
            />
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = () => {
    toast("Primary Account Linked");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <StepIndicator current={stepToNum[step]} />
      <div className={contentClass}>
        {step === "overview" && (
          <OverviewStep onContinue={() => navigate("info")} />
        )}
        {step === "info" && (
          <InfoStep
            onContinue={() => navigate("enter")}
            onBack={() => navigate("overview", "back")}
          />
        )}
        {step === "enter" && (
          <EnterStep
            onVerify={handleVerify}
            onBack={() => navigate("info", "back")}
          />
        )}
      </div>
    </div>
  );
}
