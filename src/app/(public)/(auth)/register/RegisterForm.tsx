"use client";
import styles from "./register.module.css";
import * as yup from "yup";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { handleErrorDisplay } from "@/libs/helpers";
import clsx from "clsx";
import { toast } from "react-toastify";
import { RegisterSchema } from "./schema";
import { registerUser } from "./actions";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Session-only draft so a trip to the Terms & Conditions page doesn't force
// the user to retype everything on return. Passwords are deliberately left
// out of the draft.
const DRAFT_KEY = "register-form-draft";

type RegisterDraft = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  tosChecked: boolean;
};

const RegisterForm = () => {
  const router = useRouter();
  const [isTosChecked, setIsTosChecked] = useState<boolean>(false);

  const formik = useFormik<yup.InferType<typeof RegisterSchema>>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      if (!response.success) {
        setSubmitting(false);
        toast.error(response.message);
        return;
      }

      sessionStorage.removeItem(DRAFT_KEY);
      toast.success("Sign up successful");

      router.replace(
        `/verification/email?email=${values.email}&phone=${values.phoneNumber}`,
      );
    },
  });

  // Restore whatever was filled in before the user navigated away, e.g. to
  // read the Terms & Conditions page. Reading sessionStorage has to happen
  // in an effect (it isn't available during SSR), and re-applying the same
  // saved draft a second time — e.g. under React Strict Mode's dev-only
  // double-invoke of effects — is harmless since nothing else writes to
  // the draft during mount.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (!saved) return;

      const draft: Partial<RegisterDraft> = JSON.parse(saved);
      formik.setValues((prev) => ({
        ...prev,
        firstName: draft.firstName ?? prev.firstName,
        lastName: draft.lastName ?? prev.lastName,
        email: draft.email ?? prev.email,
        phoneNumber: draft.phoneNumber ?? prev.phoneNumber,
      }));
      setIsTosChecked(!!draft.tosChecked);
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
    }
    // Restore once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist directly from each change handler rather than reactively via a
  // `useEffect` watching formik.values — an effect-based approach fires on
  // mount (before the restore effect's state update has landed) and can
  // clobber the just-restored draft with the form's blank initial values.
  // `overrides` carries the field that just changed, since formik.values
  // in this render's closure won't reflect it yet.
  const persistDraft = (overrides: Partial<RegisterDraft> = {}) => {
    const draft: RegisterDraft = {
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      email: formik.values.email,
      phoneNumber: formik.values.phoneNumber,
      tosChecked: isTosChecked,
      ...overrides,
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  return (
    <div className={styles.formWrapper}>
      <form className={styles.rightSide} onSubmit={formik.handleSubmit}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Create a Secure Account</h1>
          <p className={styles.subHeading}>
            Fill in your details to be able to create a secure account for PAZ
          </p>
        </div>

        <div className={styles.halfWidthInputsContainer}>
          <div className={clsx(styles.inputGroup, styles.shortInputGroup)}>
            <Input
              id="first-name"
              label="First Name"
              placeholder="Enter your first name"
              {...formik.getFieldProps("firstName")}
              onChange={(e) => {
                formik.handleChange(e);
                persistDraft({ firstName: e.target.value });
              }}
              errors={handleErrorDisplay(formik, "firstName")}
            />
          </div>

          <div className={clsx(styles.inputGroup, styles.shortInputGroup)}>
            <Input
              id="last-name"
              label="Last Name"
              placeholder="Enter your last name"
              {...formik.getFieldProps("lastName")}
              onChange={(e) => {
                formik.handleChange(e);
                persistDraft({ lastName: e.target.value });
              }}
              errors={handleErrorDisplay(formik, "lastName")}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="you@gmail.com"
            {...formik.getFieldProps("email")}
            onChange={(e) => {
              formik.handleChange(e);
              persistDraft({ email: e.target.value });
            }}
            errors={handleErrorDisplay(formik, "email")}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Phone Number"
            id="phone-number"
            type="tel"
            placeholder="0802345****"
            {...formik.getFieldProps("phoneNumber")}
            onChange={(e) => {
              formik.handleChange(e);
              persistDraft({ phoneNumber: e.target.value });
            }}
            errors={handleErrorDisplay(formik, "phoneNumber")}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Password"
            type="password"
            id="password"
            {...formik.getFieldProps("password")}
            placeholder="******"
            errors={handleErrorDisplay(formik, "password")}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Confirm Password"
            id="confirm-password"
            type="password"
            placeholder="******"
            {...formik.getFieldProps("confirmPassword")}
            errors={handleErrorDisplay(formik, "confirmPassword")}
          />
        </div>

        <div className={styles.tosContainer}>
          <input
            id="tos"
            className={styles.tosInput}
            name="tos"
            type="checkbox"
            checked={isTosChecked}
            onChange={() => {
              const checked = !isTosChecked;
              setIsTosChecked(checked);
              persistDraft({ tosChecked: checked });
            }}
          />
          <label htmlFor="tos">
            I agree to{" "}
            <Link className={styles.linkText} href="/tos">
              Terms and Condition
            </Link>
          </label>
        </div>

        <Button
          disabled={!isTosChecked}
          onClick={formik.submitForm}
          loading={formik.isSubmitting}
        >
          Create Account
        </Button>
      </form>
      <div style={{ display: "none" }}>
        {/* We aren't doing the google sign up thing yet, so there's no need to implement it*/}
        <div className={styles.orContainer}>
          <hr />
          <p className={styles.orText}>OR</p>
          <hr />
        </div>
      </div>

      <div className={styles.bottomText}>
        <p>
          Already have an account?{" "}
          <Link href="/login" className={styles.linkText}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
