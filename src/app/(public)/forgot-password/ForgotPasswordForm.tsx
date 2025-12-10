"use client";
import styles from "./forgot.module.css";
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
    <>
      <h3>Forgot Your Password</h3>

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
            <FaArrowLeft className={styles.arrowLeft} /> Return to Log in{" "}
          </Link>
        </div>
      </form>

      <div className={styles.bottomContainer}>
        <p>
          Still having trouble? <a href="mailto:info@mypazfinance.com"></a>{" "}
        </p>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
