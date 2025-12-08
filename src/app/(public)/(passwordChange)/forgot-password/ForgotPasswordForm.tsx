"use client";
import styles from "./forgot.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useForgotPassword } from "@/data/mutations/useForgotPassword";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required()
});

type ForgotPasswordSchema = yup.InferType<typeof schema>;
const ForgotPasswordForm = () => {
  const ForgotPassword = useForgotPassword();
  const formik = useFormik<ForgotPasswordSchema>({
    initialValues: {
      email: ""
    },
    validationSchema: schema,
    onSubmit: (values, formikHelpers) => {
      ForgotPassword.mutate({ email: values.email });
      console.log(values);
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
        <p>
          Still having trouble? <a href="https://paz-website.vercel.app/contact">Contact support</a>
        </p>
        <Button type="submit" className={styles.primary} label="Login">
          Reset Password
        </Button>
        <Link href="/login" className={styles.returnToLogin}>
          <FaArrowLeft className={styles.arrowLeft} /> Return to Log in{" "}
        </Link>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
