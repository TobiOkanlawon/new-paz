"use client";
import styles from "./forgotPassword.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required(),
  password: yup
    .string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character",
    ),
  remember: yup.boolean(),
});

type ForgotPasswordSchema = yup.InferType<typeof schema>;
const ForgotPasswordForm = () => {
  const formik = useFormik<ForgotPasswordSchema>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: schema,
    onSubmit: (values, formikHelpers) => {
      alert(values);
    },
  });
  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Reset Password</h3>
      <p className={styles.headerText}>
        Enter the email address you used to sign up and we’ll send instructions
        to reset your password
      </p>

      <form
        action="POST"
        onSubmit={formik.handleSubmit}
        className={styles.form}
      >
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter the email address you registered"
          id="email"
          {...formik.getFieldProps("email")}
        />
        <Button type="submit" className={styles.primary} label="Login">
          Reset Password
        </Button>
        <div className={styles.centerAlign}>
          <Link href="/login" className={styles.returnToLogin}>
            Go Back
          </Link>
        </div>
      </form>

      <div className={styles.bottomContainer}>
        <p>
          Still having trouble? <a href="mailto:info@mypazfinance.com"></a>{" "}
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
