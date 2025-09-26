"use client";
import React, { useState } from "react";
import styles from "./bvnm.module.css";
import Modal from "../Modal";
import Button from "../Button";
import { LuArrowLeft } from "react-icons/lu";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";

interface BvnmPropTypes {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (values: { bvn: string; dob: string }) => void;
}

// Validation schema
const validationSchema = Yup.object().shape({
  bvn: Yup.string()
    .required("BVN is required")
    .matches(/^\d{11}$/, "BVN must be exactly 11 digits"),
  dob: Yup.date()
    .required("Date of Birth is required")
    .max(new Date(), "DOB can't be in the future"),
});

const BVNModal: React.FC<BvnmPropTypes> = ({
  isOpen,
  onClose,
  handleSubmit,
}) => {
  const [isBVNConfirmed, setIsBVNConfirmed] = useState(false);
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        {isBVNConfirmed ? (
          <div className={styles.success}>
            <Image
              src={"/confettiBall.png"}
              alt=""
              height={90}
              width={90}
              className={styles.confetti}
            />
            <h1 className={styles.modalHeader}>Success!</h1>
            <p className={styles.modalDetails}>Your BVN has been verified!</p>

            <div className={styles.backContainer} onClick={onClose}>
              <LuArrowLeft />
              <p>Back</p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className={styles.modalHeader}>Add your BVN</h1>
            <p className={styles.modalDetails}>
              You can verify your identity on PAZ with your BVN
            </p>

            <Formik
              initialValues={{ bvn: "", dob: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                handleSubmit(values);
                actions.setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className={styles.formContainer}>
                  <div className={styles.inputGroup}>
                    <label className={styles.labels} htmlFor="bvn">
                      BVN
                    </label>
                    <Field
                      className={styles.inputs}
                      type="text"
                      name="bvn"
                      placeholder="Enter your BVN number"
                    />
                    <ErrorMessage
                      name="bvn"
                      component="div"
                      className={styles.errorText}
                    />
                    <p className={styles.bvnGuide}>
                      To get your BVN, dial *565*0#
                    </p>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.labels} htmlFor="dob">
                      Date of Birth
                    </label>
                    <Field
                      className={styles.inputs}
                      type="date"
                      name="dob"
                      id="dob"
                    />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className={styles.errorText}
                    />
                  </div>

                  <div className={styles.buttonContainer}>
                    <Button
                      type="submit"
                      label="Verify BVN"
                      loading={isSubmitting}
                      className={styles.submitButton}
                    />
                  </div>

                  <div className={styles.backContainer} onClick={onClose}>
                    <LuArrowLeft />
                    <p>Back</p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BVNModal;
