"use client";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/Button";
import { verifyEmail, resendCode } from "../actions";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../verification.module.css";
import emailStyles from "./emailVerification.module.css";
import useCountdownTimer from "@/hooks/useCountdownTimer";

/* The email verification page */
const EmailVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const timeInSeconds = 2 * 60; // two minutes
  const [time, setTime, isDone] = useCountdownTimer(timeInSeconds);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const params = useSearchParams();

  const hasSentRef = useRef(false);

  useEffect(() => {
    // basically, if there's no email in the URL, then there's actually no way to correlate the OTP with the user

    const email = params.get("email");
    const mobilePhone = params.get("phone");

    if (email) {
      setEmail(email);
      if (mobilePhone) {
        setPhone(mobilePhone);
      } else {
        toast.error("Something seems wrong");
      }
      router.replace("/verification/email");
    }
    // TODO: ideally, there should be a redirect from the page if there's no email in the URL, but we'll leave it till the backend implementation for the alternate path is up
  }, [params, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted) {
      const newOtp = [...otp];
      pasted.split("").forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleResendCode = async () => {
    // just return if the email does not succeed
    if (!email || hasSentRef.current) return;

    const res = await resendCode("email", email);

    if (!res.success) {
      toast.error("Failed to resend OTP");
    } else {
      setTime(timeInSeconds);
    }

    setOtp(["", "", "", "", "", ""]);
  };

  const handleVerify = async () => {
    if (email === "") {
      return;
    }

    const response = await verifyEmail(otp.join(""), email);

    if (!response.success) {
      toast.error(response.error || "Email verification failed");
      return;
    }

    toast.success("Email verification successful");

    router.push(`/verification/phone?phone=${phone}`);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        padding: "48px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "700",
              color: "#111",
              marginBottom: "10px",
            }}
          >
            Email Verification
          </h2>
          {email ? (
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "36px",
              }}
            >
              Enter OTP code sent to {email}
            </p>
          ) : (
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "36px",
              }}
            >
              Enter OTP code sent to your email below
            </p>
          )}

          {/* OTP Inputs */}
          <div
            className={emailStyles.otpContainer}
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`${emailStyles.otpInput} ${
                  digit ? emailStyles.otpInputFilled : ""
                }`}
              />
            ))}
          </div>

          <div className={styles.timer}>{time}</div>

          {/* Verify Button */}
          <Button disabled={otp.join("").length !== 6} onClick={handleVerify}>
            Verify Email
          </Button>

          {/* Resend */}
          <p
            onClick={isDone ? handleResendCode : undefined}
            style={{
              opacity: isDone ? 1 : 0.5,
              cursor: isDone ? "pointer" : "not-allowed",
              fontSize: "13px",
              color: "#888",
            }}
          >
            Didn't receive a code?{" "}
            <span
              style={{
                color: "#3b5bdb",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Resend code
            </span>{" "}
          </p>
        </>
      </div>
    </div>
  );
};

export default EmailVerification;
