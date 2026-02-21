"use client";
import styles from "./resetForm.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { handleErrorDisplay } from "@/libs/helpers";

const schema = yup.object({
  password: yup
    .string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character",
    ),
  passwordConfirmation: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

type ResetPasswordSchema = yup.InferType<typeof schema>;
const ResetPasswordForm = () => {
  const formik = useFormik<ResetPasswordSchema>({
    initialValues: {
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: schema,
    onSubmit: (values, formikHelpers) => {
      alert(values);
    },
  });
  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Reset Password</h3>
      <p className={styles.headerText}>Enter your new password</p>

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
          errors={handleErrorDisplay(formik, "password")}
        />
        <Input
          label="Verify new password"
          type="password"
          placeholder="Repeat the new password"
          id="passwordConfirmation"
          {...formik.getFieldProps("passwordConfirmation")}
          errors={handleErrorDisplay(formik, "passwordConfirmation")}
        />
        <Button type="submit" className={styles.primary} label="Login">
          Create new password
        </Button>
        <div className={styles.centerAlign}>
          <Link href="/login" className={styles.returnToLogin}>
            Go Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
