"use client";
import styles from "./forgotPassword.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { resetPassword } from "@/actions/forgotPassword";
import { toast } from "react-toastify";
import { handleErrorDisplay } from "@/libs/helpers";

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("You have to supply an email"),
});

type ForgotPasswordSchema = yup.InferType<typeof schema>;
const ForgotPasswordForm = () => {
  const formik = useFormik<ForgotPasswordSchema>({
    initialValues: {
      email: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await resetPassword(values.email);

      if (!response.success) {
        setSubmitting(false);
        toast.error(response.error.responseMessage);
        return;
      }

      toast.success("Reset instructions have been sent to your email address");
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
          errors={handleErrorDisplay(formik, "email")}
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
    </div>
  );
};

export default ForgotPasswordForm;
