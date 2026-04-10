"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Button from "@/components/Button";
import { verifyEmail as verifyPhone, resendCode } from "../actions";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import phoneStyles from "./phoneVerification.module.css";
import useCountdownTimer from "@/hooks/useCountdownTimer";

/* The Phone verification page */
const PhoneVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef(Array(6).fill(null));

  const [phone, setPhone] = useState("");
  const timeInSeconds = 2 * 60; // two minutes
  // const timeInSeconds = 16;
  const [time, setTime, isDone] = useCountdownTimer(timeInSeconds);

  const params = useSearchParams();

  const router = useRouter();

  const hasSentRef = useRef(false);

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

  const handleResend = useCallback(async () => {
    // just return if the email does not succeed
    if (!phone || hasSentRef.current) return;

    const res = await resendCode("phone", phone);

    if (!res.success) {
      toast.error("Failed to resend OTP");
    } else {
      setTime(timeInSeconds);
    }

    setOtp(["", "", "", "", "", ""]);
  }, [phone, setTime, timeInSeconds]);

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

  const handleVerify = async () => {
    if (phone === "") {
      return;
    }

    const response = await verifyPhone(otp.join(""), phone);

    if (!response.success) {
      toast.error("Phone verification failed");
      return;
    }

    toast.success("Phone verification successful. Log in");

    router.push("/login");
  };

  useEffect(() => {
    // basically, if there's no email in the URL, then there's actually no way to correlate the OTP with the user

    const phone = params.get("phone");

    if (phone) {
      setPhone(phone);
      router.replace("/verification/phone");
    }
    // TODO: ideally, there should be a redirect from the page if there's no email in the URL, but we'll leave it till the backend implementation for the alternate path is up
  }, [params, router]);

  useEffect(() => {
    /* send an OTP once the page opens for the first time, because it doesn't send authomatically from the backend */

    if (!phone) return;

    handleResend();
  }, [phone, handleResend]);

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
            Phone Verification
          </h2>
          {phone ? (
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "36px",
              }}
            >
              Enter OTP code sent to {phone.slice(0, 4)}****{phone.slice(8)}
            </p>
          ) : (
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "36px",
              }}
            >
              Enter OTP code sent to your phone number below
            </p>
          )}

          {/* OTP Inputs */}
          <div
            className={phoneStyles.otpContainer}
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
                className={`${phoneStyles.otpInput} ${
                  digit ? phoneStyles.otpInputFilled : ""
                }`}
              />
            ))}
          </div>

          <p>{time}</p>

          {/* Verify Button */}
          <Button disabled={otp.join("").length !== 6} onClick={handleVerify}>
            Verify Phone Number
          </Button>

          {/* Resend */}
          <p
            onClick={isDone ? handleResend : undefined}
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
            </span>
          </p>
        </>
      </div>
    </div>
  );
};

export default PhoneVerification;
