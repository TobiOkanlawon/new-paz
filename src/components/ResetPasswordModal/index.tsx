import React from "react";
import styles from "./RPM.module.css";
import Modal from "../Modal";
import Input from "../Input";
import Button from "../Button";
import { useFormik } from "formik";
import * as yup from "yup";

interface ResetPasswordModalProp {
  isOpen: boolean;
  onClose: () => void;
}

const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,}).*$/;

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Make sure you enter new password")
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password must be less than 128 characters.")
    .matches(
      passwordRules,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*).",
    ),
  confirmPassword: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password")], "Passwords must match."),
});

const ResetPasswordModal = ({ isOpen, onClose }: ResetPasswordModalProp) => {

    const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
    },
  });

  const { 
    handleSubmit, 
    handleChange, 
    handleBlur, 
    values, 
    errors, 
    touched, 
    isSubmitting 
  } = formik;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1 className={styles.header}>Reset your Password</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <Input
            label="Password"
            name="newPassword"
            placeholder="Enter new password"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.newPassword}
          />
          {touched.newPassword && errors.newPassword ? (
          <div className={styles.errorMessage}>{errors.newPassword}</div>
        ) : null}
        </div>
        <div className={styles.inputContainer}>
          <Input
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Repeat the new password"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.confirmPassword}
          />
          {touched.confirmPassword && errors.confirmPassword ? (
          <div className={styles.errorMessage}>{errors.confirmPassword}</div>
        ) : null}
        </div>
        <Button
            type="submit" 
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;
