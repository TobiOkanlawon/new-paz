"use client";
import React, { useState, useCallback } from "react";
import styles from "./RPM.module.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { LuShield } from "react-icons/lu";

interface SecurityQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUESTION_BANK = [
  { group: "Childhood",   items: [
    "What was the name of your first pet?",
    "What was the name of your childhood best friend?",
    "What was the street you grew up on?",
    "What was the name of your primary school?",
  ]},
  { group: "Personal",   items: [
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is the middle name of your oldest sibling?",
    "What was your childhood nickname?",
  ]},
  { group: "Favourites", items: [
    "What is the name of your favourite childhood book?",
    "What was the make of your first car?",
    "What is your favourite film of all time?",
    "What is your favourite sports team?",
  ]},
];

const ALL_QUESTIONS = QUESTION_BANK.flatMap(g => g.items);

/* Validation schemas for each step */
const stepSchemas = [
  yup.object({ question1: yup.string().required("Please select a question."), answer1: yup.string().required("Please enter your answer.").min(2, "Answer is too short.") }),
  yup.object({ question2: yup.string().required("Please select a question.").notOneOf([yup.ref("question1")], "Please choose a different question."), answer2: yup.string().required("Please enter your answer.").min(2, "Answer is too short.") }),
  yup.object({ question3: yup.string().required("Please select a question."), answer3: yup.string().required("Please enter your answer.").min(2, "Answer is too short.") }),
];

type FormValues = {
  question1: string; answer1: string;
  question2: string; answer2: string;
  question3: string; answer3: string;
};

const STEPS = [
  { number: 1, label: "Question 1" },
  { number: 2, label: "Question 2" },
  { number: 3, label: "Question 3" },
];

const SecurityQuestionsModal = ({ isOpen, onClose }: SecurityQuestionsModalProps) => {
  const [step, setStep] = useState(0); // 0,1,2 = questions; 3 = success
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const formik = useFormik<FormValues>({
    initialValues: {
      question1: "", answer1: "",
      question2: "", answer2: "",
      question3: "", answer3: "",
    },
    validationSchema: stepSchemas[step] ?? yup.object(),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      // Final submit on step 3
      await new Promise(r => setTimeout(r, 1200));
      console.log("Security questions saved:", values);
      helpers.setSubmitting(false);
      setStep(3);
    },
  });

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      formik.resetForm();
      setStep(0);
      setStepErrors({});
    }, 250);
  }, [onClose, formik]);

  const handleNext = async () => {
    const schema = stepSchemas[step];
    try {
      await schema.validate(formik.values, { abortEarly: false });
      setStepErrors({});
      setStep(s => s + 1);
    } catch (err: any) {
      const errs: Record<string, string> = {};
      err.inner?.forEach((e: any) => { errs[e.path] = e.message; });
      setStepErrors(errs);
    }
  };

  // Question/answer field keys for the current step
  const qKey = `question${step + 1}` as keyof FormValues;
  const aKey = `answer${step + 1}`   as keyof FormValues;

  // Questions already used in previous steps (don't let user pick same twice)
  const usedQuestions = [formik.values.question1, formik.values.question2, formik.values.question3]
    .filter((_, i) => i !== step);

  const isLastStep = step === 2;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-questions-title"
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
        <div className={styles.modalIconWrap}><LuShield size={22} /></div>
        <h2 id="security-questions-title" className={styles.modalTitle}>Security Questions</h2>
        <p className={styles.modalSubtitle}>
          Set 3 questions to verify your identity when needed
        </p>
      </div>

      {step === 3 ? (
        /* ── Success ── */
        <div className={styles.successState}>
          <div className={styles.successIcon}><LuShield size={28} /></div>
          <h3 className={styles.successTitle}>Questions Saved!</h3>
          <p className={styles.successSub}>
            Your security questions have been set. They'll be used to verify your identity if you ever need account recovery.
          </p>
          <button className={styles.successBtn} onClick={handleClose}>Done</button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.modalBody}>

            {/* ── Step indicator ── */}
            <div className={styles.stepRow}>
              {STEPS.map((s, i) => (
                <React.Fragment key={s.number}>
                  <div className={styles.step}>
                    <div className={`${styles.stepCircle} ${
                      i < step ? styles.done : i === step ? styles.active : ""
                    }`}>
                      {i < step ? "✓" : s.number}
                    </div>
                    <span className={`${styles.stepText} ${
                      i < step ? styles.done : i === step ? styles.active : ""
                    }`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`${styles.stepLine} ${i < step ? styles.done : ""}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* ── Question card ── */}
            <div className={styles.qCard}>
              <span className={styles.qCardLabel}>Question {step + 1} of 3</span>

              {/* Select question */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Choose a question<span className={styles.fieldRequired}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${stepErrors[qKey] ? styles.hasError : ""}`}>
                  <select
                    className={styles.select}
                    name={qKey}
                    value={formik.values[qKey]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select a security question…</option>
                    {QUESTION_BANK.map(group => (
                      <optgroup key={group.group} label={group.group}>
                        {group.items.map(q => (
                          <option
                            key={q}
                            value={q}
                            disabled={usedQuestions.includes(q)}
                          >
                            {q}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {stepErrors[qKey] && (
                  <span className={styles.errorMsg}>{stepErrors[qKey]}</span>
                )}
              </div>

              {/* Answer */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Your Answer<span className={styles.fieldRequired}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${stepErrors[aKey] ? styles.hasError : ""}`}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Type your answer here"
                    name={aKey}
                    value={formik.values[aKey]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
                {stepErrors[aKey] && (
                  <span className={styles.errorMsg}>{stepErrors[aKey]}</span>
                )}
              </div>
            </div>

            {/* ── Tip ── */}
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              color: "#8a96a3",
              fontWeight: 500,
              lineHeight: 1.5,
              margin: "-0.2rem 0",
            }}>
              Tip: Answers are case-insensitive. Choose something memorable but not obvious to others.
            </p>

            {/* ── Navigation ── */}
            <div className={step > 0 ? styles.navRow : undefined}>
              {step > 0 && (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => { setStepErrors({}); setStep(s => s - 1); }}
                >
                  ← Back
                </button>
              )}

              {isLastStep ? (
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={formik.isSubmitting}
                  style={step > 0 ? undefined : { marginTop: "0.4rem" }}
                >
                  {formik.isSubmitting ? (
                    <><span className={styles.spinner} /> Saving…</>
                  ) : (
                    "Save Questions →"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={handleNext}
                  style={step > 0 ? undefined : { marginTop: "0.4rem" }}
                >
                  Next Question →
                </button>
              )}
            </div>
          </div>
        </form>
      )}
      </div>
    </div>
  );
};

export default SecurityQuestionsModal;