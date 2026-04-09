"use client";
import React, { useState, useCallback } from "react";
import styles from "./RPM.module.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { LuKey, LuLock, LuShield } from "react-icons/lu";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,}).*$/;

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Please enter a new password.")
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be less than 128 characters.")
    .matches(
      passwordRules,
      "Must include uppercase, lowercase, number and special character.",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password.")
    .oneOf([yup.ref("password")], "Passwords do not match."),
});

/* ── Strength logic ── */
type StrengthLevel = "weak" | "fair" | "strong" | "great";

function getStrength(pw: string): {
  level: StrengthLevel;
  score: number;
  color: string;
  label: string;
} {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw))    score++;
  if (/[!@#$%^&*]/.test(pw)) score++;

  if (score <= 1) return { level: "weak",   score: 20,  color: "#ef4444", label: "Weak" };
  if (score === 2) return { level: "fair",   score: 45,  color: "#f97316", label: "Fair" };
  if (score === 3) return { level: "strong", score: 72,  color: "#eab308", label: "Good" };
  return             { level: "great",  score: 100, color: "#22c55e", label: "Strong" };
}

type HintKey = "length" | "upper" | "lower" | "number" | "special";
const HINTS: { key: HintKey; label: string; test: (p: string) => boolean }[] = [
  { key: "length",  label: "8+ chars",    test: p => p.length >= 8 },
  { key: "upper",   label: "Uppercase",   test: p => /[A-Z]/.test(p) },
  { key: "lower",   label: "Lowercase",   test: p => /[a-z]/.test(p) },
  { key: "number",  label: "Number",      test: p => /\d/.test(p) },
  { key: "special", label: "Special (!@#$)", test: p => /[!@#$%^&*]/.test(p) },
];

/* ── Component ── */
const ResetPasswordModal = ({ isOpen, onClose }: ResetPasswordModalProps) => {
  const [showPw, setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess]    = useState(false);

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      // Replace with real API call
      await new Promise(r => setTimeout(r, 1200));
      console.log("Reset password:", values);
      helpers.setSubmitting(false);
      setSuccess(true);
    },
  });

  const handleClose = useCallback(() => {
    onClose();
    // slight delay so animation plays before reset
    setTimeout(() => {
      formik.resetForm();
      setSuccess(false);
      setShowPw(false);
      setShowConfirm(false);
    }, 250);
  }, [onClose, formik]);

  const strength = getStrength(formik.values.password);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-title"
        onClick={(e) => e.stopPropagation()}
      >
      {/* ── Header ── */}
      <div className={styles.modalHeader}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >✕</button>
        <div className={styles.modalIconWrap}><LuKey size={22} /></div>
        <h2 id="reset-password-title" className={styles.modalTitle}>Reset Password</h2>
        <p className={styles.modalSubtitle}>
          Create a strong new password for your account
        </p>
      </div>

      {success ? (
        /* ── Success state ── */
        <div className={styles.successState}>
          <div className={styles.successIcon}><LuShield size={28} /></div>
          <h3 className={styles.successTitle}>Password Updated!</h3>
          <p className={styles.successSub}>
            Your password has been changed successfully. You can now log in with your new password.
          </p>
          <button className={styles.successBtn} onClick={handleClose}>
            Done
          </button>
        </div>
      ) : (
        /* ── Form ── */
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.modalBody}>
            {/* New password */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                New Password<span className={styles.fieldRequired}>*</span>
              </label>
              <div className={`${styles.inputWrap} ${
                formik.touched.password && formik.errors.password ? styles.hasError : ""
              }`}>
                <span className={styles.inputIcon}><LuLock size={16} /></span>
                <input
                  className={styles.input}
                  type={showPw ? "text" : "password"}
                  placeholder="Enter new password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <span className={styles.errorMsg}>{formik.errors.password}</span>
              )}
            </div>

            {/* Strength meter — shown as soon as user starts typing */}
            {formik.values.password.length > 0 && (
              <div className={styles.strengthWrap}>
                <div className={styles.strengthTrack}>
                  <div
                    className={styles.strengthFill}
                    style={{ width: `${strength.score}%`, background: strength.color }}
                  />
                </div>
                <div className={styles.strengthRow}>
                  <span className={styles.strengthLabel} style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <div className={styles.strengthHints}>
                  {HINTS.map(h => {
                    const met = h.test(formik.values.password);
                    return (
                      <span key={h.key} className={`${styles.hint} ${met ? styles.hintMet : ""}`}>
                        <span className={styles.hintDot} />
                        {h.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.divider} />

            {/* Confirm password */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Confirm Password<span className={styles.fieldRequired}>*</span>
              </label>
              <div className={`${styles.inputWrap} ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? styles.hasError : ""
              }`}>
                <span className={styles.inputIcon}><LuLock size={16} /></span>
                <input
                  className={styles.input}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm(p => !p)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <span className={styles.errorMsg}>{formik.errors.confirmPassword}</span>
              )}

              {/* Match indicator */}
              {formik.values.confirmPassword.length > 0 &&
                !formik.errors.confirmPassword && (
                  <span className={styles.errorMsg} style={{ color: "#22c55e" }}>
                    Passwords match
                  </span>
                )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <><span className={styles.spinner} /> Updating…</>
              ) : (
                "Update Password →"
              )}
            </button>
          </div>
        </form>
      )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;