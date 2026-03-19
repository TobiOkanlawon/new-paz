"use client";
import styles from "./register.module.css";
import * as yup from "yup";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { handleErrorDisplay } from "@/libs/helpers";
import clsx from "clsx";
import { toast } from "react-toastify";
import { RegisterSchema } from "./schema";
import { registerUser } from "./actions";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const RegisterForm = () => {
  const router = useRouter();

  const session = useSession();

  const formik = useFormik<yup.InferType<typeof RegisterSchema>>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      if (!response.success) {
        setSubmitting(false);
        toast.error(response.message);
        return;
      }

      toast.success("Sign up successful");

      router.replace(
        `/verification/email?email=${values.email}&phone=${values.phoneNumber}`,
      );
    },
  });

  return (
    <div>
      <form className={styles.rightSide} onSubmit={formik.handleSubmit}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Create a Secure Account</h1>
          <p className={styles.subHeading}>
            Fill in your details to be able to create a secure account for PAZ
          </p>
        </div>

        <div className={styles.halfWidthInputsContainer}>
          <div className={clsx(styles.inputGroup, styles.shortInputGroup)}>
            <Input
              id="first-name"
              label="First Name"
              placeholder="Esther"
              {...formik.getFieldProps("firstName")}
              errors={handleErrorDisplay(formik, "firstName")}
            />
          </div>

          <div className={clsx(styles.inputGroup, styles.shortInputGroup)}>
            <Input
              id="last-name"
              label="Last Name"
              placeholder="Williams"
              {...formik.getFieldProps("lastName")}
              errors={handleErrorDisplay(formik, "lastName")}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="estherwilliams22@gmail.com"
            {...formik.getFieldProps("email")}
            errors={handleErrorDisplay(formik, "email")}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Phone Number"
            id="phone-number"
            type="tel"
            placeholder="08023451234"
            {...formik.getFieldProps("phoneNumber")}
            errors={handleErrorDisplay(formik, "phoneNumber")}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Password"
            type="password"
            id="password"
            {...formik.getFieldProps("password")}
            placeholder="******"
            errors={handleErrorDisplay(formik, "password")}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Confirm Password"
            id="confirm-password"
            type="password"
            placeholder="******"
            {...formik.getFieldProps("confirmPassword")}
            errors={handleErrorDisplay(formik, "confirmPassword")}
          />
        </div>

        <div className={styles.tosContainer}>
          <input
            id="tos"
            className={styles.tosInput}
            name="tos"
            type="checkbox"
            value=""
          />
          <label htmlFor="tos">
            I agree to{" "}
            <Link className={styles.linkText} href="/tos">
              terms and agreement
            </Link>{" "}
            &{" "}
            <Link className={styles.linkText} href="/privacy">
              privacy policy{" "}
            </Link>
          </label>
        </div>

        <Button onClick={formik.submitForm} loading={formik.isSubmitting}>
          Create Account
        </Button>
      </form>
      <div style={{ display: "none" }}>
        {/* We aren't doing the google sign up thing yet, so there's no need to implement it*/}
        <div className={styles.orContainer}>
          <hr />
          <p className={styles.orText}>OR</p>
          <hr />
        </div>
      </div>

      <div className={styles.bottomText}>
        <p>
          Already have an account?{" "}
          <Link href="/login" className={styles.linkText}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
