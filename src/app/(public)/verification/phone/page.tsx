"use client";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/Button";
import { verifyEmail, resendCode } from "../actions";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";

/* The Phone verification page */
const PhoneVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [phone, setPhone] = useState("");

  const params = useSearchParams();

  const router = useRouter();

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

  const handleResend = async () => {
    // just return if the email does not succeed
    if (!phone) return;

    const res = await resendCode("phone", phone);

    if (!res.success) {
      toast.error("Failed to resend OTP");
    }

    setOtp(["", "", "", "", "", ""]);
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

  const handleVerify = async () => {
    const response = await verifyEmail(otp.join(""), phone);

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
    /* send an OTP once the page opens for the first time */

    if (!phone) return;

    handleResend();
  }, [phone]);

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
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "36px",
            }}
          >
            Enter OTP code sent to your phone number below
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

          {/* Verify Button */}
          <Button disabled={otp.join("").length !== 6} onClick={handleVerify}>
            Verify Phone Number
          </Button>

          {/* Resend */}
          <p style={{ fontSize: "13px", color: "#888" }} onClick={handleResend}>
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
