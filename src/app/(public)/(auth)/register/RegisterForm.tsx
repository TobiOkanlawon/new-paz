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

const schema = yup.object({
  firstName: yup
    .string()
    .required("You must specify a first name")
    .min(2, "This first name doesn't seem valid")
    .max(32, "You're first name cannot be longer than 32 characters"),
  lastName: yup
    .string()
    .required("You must specify a last name")
    .min(2, "This last name doesn't seem valid")
    .max(32, "You're last name cannot be longer than 32 characters"),
  phoneNumber: yup
    .string()
    .length(11, "You must specify a valid phone number")
    .required("You must specify a phone number"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("You must specify an email"),
  password: yup
    .string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character",
    ),
  confirmPassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

type RegisterSchema = yup.InferType<typeof schema>;
const RegisterForm = () => {
  const router = useRouter();
  const signUpMutation = useSignup();
  const formik = useFormik<RegisterSchema>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      signUpMutation.mutate(
        {
          ...values,
          mobileNumber: values.phoneNumber,
        },
        {
          onSuccess: () => {
            router.replace("/login");
          },
        },
      );
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
        <div className={styles.flexed}>
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
        </div>
        <div className={styles.flexed}>
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
          By clicking "Create Account”, I agree to PAZ’s <a href="#">privacy policy</a>{" "}
          and <a href="#">terms of service</a>.
        </p>
        <div className={styles.buttonContainer}>
          <Button type="submit" className={styles.primary} label="Login">
            Create Account
          </Button>
        </div>
        <div className={styles.linkWrapper}>
          <Link href="/login" className={clsx("special-underline", styles.returnToLogin)}>
            <FaArrowLeft className={styles.arrowLeft} /> Return to Log in{" "}
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
