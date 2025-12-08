"use client";
import styles from "./reset.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";

const schema = yup.object({
  password: yup
    .string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character",
    ),
});

type ResetPasswordSchema = yup.InferType<typeof schema>;
const ResetPasswordForm = () => {
  const formik = useFormik<ResetPasswordSchema>({
    initialValues: {
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values, formikHelpers) => {
      alert(values);
    },
  });
  return (
    <>
      <h3>Reset Your Password</h3>

      <form
        action="POST"
        onSubmit={formik.handleSubmit}
        className={styles.form}
      >
        <Input
          label="New password"
          type="password"
          placeholder="Enter a new password"
          id="password"
          {...formik.getFieldProps("password")}
        />
        <Input
          label="Verify new password"
          type="password"
          placeholder="Repeat the new password"
          id="password"
          {...formik.getFieldProps("password")}
        />
        <Button type="submit" className={styles.primary} label="Login">
          Create new password
        </Button>
        <Link href="/login" className={styles.returnToLogin}>
          <FaArrowLeft className={styles.arrowLeft} /> Return to Log in{" "}
        </Link>
      </form>
    </>
  );
};

export default ResetPasswordForm;
