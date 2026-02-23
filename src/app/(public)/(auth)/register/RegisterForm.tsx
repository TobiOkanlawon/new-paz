"use client";
import styles from "./register.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { handleErrorDisplay } from "@/libs/helpers";
import clsx from "clsx";
import { action } from "./actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const schema = yup.object({
  firstName: yup
    .string()
    .required("You must specify a first name")
    .min(2, "This first name doesn't seem valid")
    .max(32, "You're first name cannot be longer than 32 characters"),
  lastName: yup
    .string()
    .required("You must specify a last name")
    .min(2, "This last name doesn't seem valid")
    .max(32, "You're last name cannot be longer than 32 characters"),
  phoneNumber: yup
    .string()
    .length(11, "You must specify a valid phone number")
    .required("You must specify a phone number"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("You must specify an email"),
  password: yup
    .string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character",
    ),
  confirmPassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

type RegisterSchema = yup.InferType<typeof schema>;
const RegisterForm = () => {
  // const [state, dispatchAction, isPending] = useActionState();
  const { pending } = useFormStatus();

  return (
    <div>
      <form className={styles.rightSide} action={action}>
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
              name="First Name"
              placeholder="Esther"
            />
          </div>

          <div className={clsx(styles.inputGroup, styles.shortInputGroup)}>
            <Input
              id="last-name"
              label="Last Name"
              name="Last Name"
              placeholder="Williams"
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Email Address"
            type="email"
            id="email"
            name="Email Address"
            placeholder="estherwilliams22@gmail.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Phone Number"
            name="Phone Number"
            id="phone-number"
            type="tel"
            placeholder="08023451234"
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Password"
            type="password"
            id="password"
            name="Password"
            placeholder="******"
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Confirm Password"
            name="Confirm Password"
            id="confirm-password"
            type="password"
            placeholder="******"
          />
        </div>

        <div className={styles.tosContainer}>
          <input
            id="tos"
            className={styles.tosInput}
            name="tos"
            type="checkbox"
            value=""
          />
          <label htmlFor="tos">
            I agree to{" "}
            <Link className={styles.linkText} href="/tos">
              terms and agreement
            </Link>{" "}
            &{" "}
            <Link className={styles.linkText} href="/privacy">
              privacy policy{" "}
            </Link>
          </label>
        </div>

        <Button loading={pending}>Create Account</Button>
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
