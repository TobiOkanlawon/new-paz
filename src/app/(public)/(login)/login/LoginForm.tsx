"use client";
import styles from "./loginForm.module.css";
import * as yup from "yup";
import Link from "next/link";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import clsx from "clsx";
import { handleErrorDisplay } from "@/libs/helpers";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { NotVerifiedError } from "@/libs/errors";

// Helper functions for email cookie
const setEmailCookie = (email: string) => {
  document.cookie = `rememberedEmail=${encodeURIComponent(email)}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
};

const getEmailCookie = (): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "rememberedEmail") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

const clearEmailCookie = () => {
  document.cookie = "rememberedEmail=; path=/; max-age=0";
};

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
  }, [router, searchParams]);

  const formik = useFormik<LoginSchema>({
    initialValues: {
      email: typeof window !== "undefined" ? getEmailCookie() || "" : "",
      password: "",
      remember: typeof window !== "undefined" && getEmailCookie() !== null,
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result) {
        toast.error("An error occurred");
        return;
      }

      if (result.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          router.push("/verification/email");
          return;
        }

        if (result.error === "PHONE_NOT_VERIFIED") {
          router.push("/verification/phone");
          return;
        }

        toast.error("Invalid email or password");
        setErrors({
          email: "Invalid email or password",
        });
        return;
      }

      if (result.ok) {
        // Handle remember me - only store email, never password
        if (values.remember) {
          setEmailCookie(values.email);
        } else {
          clearEmailCookie();
        }
        router.push("/dashboard");
      }
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
          placeholder="you@gmail.com"
          id="email"
          className={styles.email}
          {...formik.getFieldProps("email")}
          errors={handleErrorDisplay(formik, "email")}
        />
        <div className={styles.password}>
          <Input
            label="Password"
            type="password"
            placeholder="********"
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
        {/*<Button
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
          </Button>*/}
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
