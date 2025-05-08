"use client";
import styles from "./page.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaArrowRight } from "react-icons/fa";
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
      <h3>Login to your account</h3>

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
        <div className={styles.formBottom}>
          <div className={styles.rememberMe}>
            <input
              type="checkbox"
              className={styles.remember}
              id="remember"
              {...formik.getFieldProps("remember")}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          <div>
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
        {/* <button className="primary" type="submit">
          Login
        </button> */}
        <Button type="submit" className={styles.primary} label="Login">
          Login
        </Button>
        <Link href="/register" className={styles.createNewAccount}>
          Create New Account <FaArrowRight />
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
