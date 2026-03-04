"use client";
import styles from "./loginForm.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import clsx from "clsx";
import { handleErrorDisplay } from "@/libs/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("You must specify an email address"),
  password: yup
    .string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/,
      "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character",
    ),
  remember: yup.boolean(),
});

type LoginSchema = yup.InferType<typeof schema>;

const LoginForm = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Account created successfully");
      router.replace("/login");
    } else if (searchParams.get("kycComplete") === "true") {
      toast.success("KYC complete. Log in again");
      router.replace("/login");
    }
  }, []);

  const formik = useFormik<LoginSchema>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result || result.error) {
        setSubmitting(false);
        setErrors({
          email: "Invalid email or password",
        });
        return;
      }

      router.replace("/dashboard");
    },
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Login</h3>
      <p className={styles.headerText}>Enter your email to log in</p>

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
          className={styles.email}
          {...formik.getFieldProps("email")}
          errors={handleErrorDisplay(formik, "email")}
        />
        <div className={styles.password}>
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            id="password"
            // className={styles.password}
            errors={handleErrorDisplay(formik, "password")}
            {...formik.getFieldProps("password")}
          />
        </div>
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
            <Link href="/forgot-password" className={styles.forgot}>
              Forgot Password?
            </Link>
          </div>
        </div>
        <Button
          loading={formik.isSubmitting}
          type="submit"
          className={styles.primary}
          label="Login"
        >
          Login
        </Button>
        <Button
          loading={formik.isSubmitting}
          type="submit"
          variant="outlined"
          className={styles.google}
          label="Sign up with Google"
        >
          <Image
            src="/images/google.png"
            height={24}
            width={24}
            alt="Google logo"
          />
          Sign up with Google
        </Button>
        <div className={styles.linkContainer}>
          <div className={styles.linkWrapper}>
            <Link
              href="/register"
              className={clsx(" ", styles.createNewAccount)}
            >
              Don’t have an account? <span>Create one</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
