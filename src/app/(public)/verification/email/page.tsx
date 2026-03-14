"use client";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/Button";
import { verifyEmail, resendCode } from "../actions";
import { toast } from "react-toastify";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import styles from "../verification.module.css";

/* The email verification page */
const EmailVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const inputRefs = useRef([]);

  const router = useRouter();

  const params = useSearchParams();

  useEffect(() => {
    // basically, if there's no email in the URL, then there's actually no way to correlate the OTP with the user

    const email = params.get("email");
    const mobilePhone = params.get("phone");

    if (email) {
      setEmail(email);
      setPhone(mobilePhone);
      router.replace("/verification/email");
    }
    // TODO: ideally, there should be a redirect from the page if there's no email in the URL, but we'll leave it till the backend implementation for the alternate path is up
  }, [params, router]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
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
    if (!email) return;

    const res = await resendCode("email", email);

    if (!res.success) {
      toast.error("Failed to resend OTP");
    }

    setOtp(["", "", "", "", "", ""]);
  };

  console.log("email", email);

  const handleVerify = async () => {
    const response = await verifyEmail(otp.join(""), email);

    if (!response.success) {
      toast.error(response.error.message || "Email verification failed");
      return;
    }

    toast.success("Email verification successful");

    router.push(`/verification/phone?phone=${phone}`);
  };

  const timer = "Expires in 2 minutes";

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
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "36px",
            }}
          >
            Enter OTP code sent to your email below
          </p>

          {/* OTP Inputs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "36px",
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: "48px",
                  height: "52px",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: "600",
                  border: digit ? "2px solid #3b5bdb" : "1.5px solid #d0d0d0",
                  borderRadius: "8px",
                  outline: "none",
                  color: "#111",
                  backgroundColor: digit ? "#f0f3ff" : "white",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              />
            ))}
          </div>

          <div className={styles.timer}>{timer}</div>

          {/* Verify Button */}
          <Button disabled={otp.join("").length !== 6} onClick={handleVerify}>
            Verify Email
          </Button>

          {/* Resend */}
          <p
            style={{ fontSize: "13px", color: "#888" }}
            onClick={handleResendCode}
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
