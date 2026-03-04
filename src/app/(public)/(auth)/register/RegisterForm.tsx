"use client";
import styles from "./register.module.css";
import * as yup from "yup";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { handleErrorDisplay } from "@/libs/helpers";
import { useSignup } from "@/data/mutations/useSignup";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { RegisterSchema } from "./schema";
import { registerUser } from "./actions";
import { toast } from "react-toastify";

type RegisterSchema = yup.InferType<typeof RegisterSchema>;
const RegisterForm = () => {
  const router = useRouter();

  const formik = useFormik<RegisterSchema>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const response = await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      if (!response.success) {
        setSubmitting(false);
        // setErrors({
        //   email: response.message,
        // });
        toast("error", response.message);
        return;
      }

      router.replace("/login");
    },
  });
  return (
    <>
      <h3>Create a secure account</h3>

      <form
        action="POST"
        onSubmit={formik.handleSubmit}
        className={styles.form}
      >
        <div className={styles.flexed}>
          <div className={styles.inputFlex}>
            <Input
              label="First Name"
              type="text"
              placeholder="Enter your first Name"
              id="firstName"
              errors={handleErrorDisplay(formik, "firstName")}
              {...formik.getFieldProps("firstName")}
            />
          </div>
          <div className={styles.inputFlex}>
            <Input
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              id="lastName"
              errors={handleErrorDisplay(formik, "lastName")}
              {...formik.getFieldProps("lastName")}
            />
          </div>
        </div>
        <div className={styles.centralize}>
          <div className={styles.inputFlex}>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              id="email"
              errors={handleErrorDisplay(formik, "email")}
              {...formik.getFieldProps("email")}
            />
          </div>
          <div className={styles.inputFlex}>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              id="phoneNumber"
              errors={handleErrorDisplay(formik, "phoneNumber")}
              {...formik.getFieldProps("phoneNumber")}
            />
          </div>
          <div className={styles.inputFlex}>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              id="password"
              errors={handleErrorDisplay(formik, "password")}
              {...formik.getFieldProps("password")}
            />
          </div>
          <div className={styles.inputFlex}>
            <Input
              label="Re - Password"
              type="password"
              placeholder="Enter Password Again"
              id="confirmPassword"
              errors={handleErrorDisplay(formik, "confirmPassword")}
              {...formik.getFieldProps("confirmPassword")}
            />
          </div>
        </div>

        <p>
          By clicking "Create Account”, I agree to PAZ’s{" "}
          <a href="#">privacy policy</a> and <a href="#">terms of service</a>.
        </p>
        <div className={styles.buttonContainer}>
          <Button
            loading={formik.isSubmitting}
            type="submit"
            className={styles.primary}
            label="Login"
          >
            Create Account
          </Button>
        </div>
        <div className={styles.linkWrapper}>
          <Link
            href="/login"
            className={clsx("special-underline", styles.returnToLogin)}
          >
            <FaArrowLeft className={styles.arrowLeft} /> Return to Log in{" "}
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
