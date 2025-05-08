"use client";
import styles from "./register.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

type LoginSchema = yup.InferType<typeof schema>;
const LoginForm = () => {
  const formik = useFormik<LoginSchema>({
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
    <div className={styles.right}>
      <h3>Create a secure account</h3>

      <form
        action="POST"
        onSubmit={formik.handleSubmit}
        className={styles.form}
      >
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          id="email"
          {...formik.getFieldProps("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          id="password"
          {...formik.getFieldProps("password")}
        />
        <Input
          label="Re - Password"
          type="password"
          placeholder="Enter the password you entered in the box above"
          id="confirmPassword"
          {...formik.getFieldProps("password")}
        />
        <p>By clicking “Sign up”, I agree to PAZ’s <a href="#">privacy policy</a> and <a href="#">terms of service</a>.</p>
        <Button type="submit" className={styles.primary} label="Login">
          Create Account
        </Button>
        <Link href="/login" className={styles.returnToLogin}><FaArrowLeft className={styles.arrowLeft}/> Return to Log in </Link>
      </form>
    </div>
  );
};

export default LoginForm;
