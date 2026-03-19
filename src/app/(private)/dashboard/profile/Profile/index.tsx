"use client";
import { useState } from "react";
import styles from "../profile.module.css";
import Image from "next/image";
import Modal from "@/components/Modal";
import {
  LuMapPin,
  LuCalendar,
  LuUser,
  LuMail,
  LuPhone,
  LuUsers,
  LuLink,
} from "react-icons/lu";

import { useFormik } from "formik";
import * as Yup from "yup";
import { formatBirthdayToDateInputFormat } from "@/libs/helpers";
import { toast } from "react-toastify";
import { saveProfile } from "@/actions/profile";

const schema = Yup.object();

type Props = {
  data: TProfile;
};

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const relationshipOptions = [
  { label: "Father", value: "father" },
  { label: "Spouse", value: "spouse" },
  { label: "Mother", value: "mother" },
  { label: "Brother", value: "brother" },
  { label: "Sister", value: "sister" },
  { label: "Other", value: "other" },
];

export type TProfileFormValues = {
  postalAddress: string;
  gender: string;
  birthday: string;
  emailAddress: string;
  phoneNumber: string;
  nextOfKinFirstName: string;
  nextOfKinLastName: string;
  nextOfKinEmail: string;
  nextOfKinPhoneNumber: string;
  relationship: string;
};

/* ── Reusable field components ── */

type FieldProps = {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
};
const Field = ({ label, icon, required, children }: FieldProps) => (
  <div className={styles.field}>
    <label className={styles.fieldLabel}>
      {label}
      {required && <span className={styles.fieldRequired}>*</span>}
    </label>
    <div className={styles.inputWrap}>
      {icon && <span className={styles.inputIcon}>{icon}</span>}
      {children}
    </div>
  </div>
);

/* ── Main component ── */

const Profile: React.FC<Props> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");

  const formik = useFormik<TProfileFormValues>({
    enableReinitialize: true,
    initialValues: {
      postalAddress: data?.address,
      birthday: formatBirthdayToDateInputFormat(data?.birthday),
      gender: data?.gender,
      emailAddress: data?.email,
      phoneNumber: data?.phoneNumber,
      nextOfKinFirstName: data?.nextOfKinFirstName,
      nextOfKinLastName: data?.nextOfKinLastName,
      nextOfKinEmail: data?.nextOfKinEmail,
      nextOfKinPhoneNumber: data?.nextOfKinPhoneNumber,
      relationship: data?.nextOfKinRelationship,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      /* NOTE: Currently, the backend only allows you to set up your next of kin once

So, we'll have to remove the next of kin data--iff the next of kin data is present in the data--from the paylaod, so that the request passes.
       */

      let req;

      if (data.nextOfKinFirstName) {
        const payload = {
          postalAddress: values.postalAddress,
          birthday: values.birthday,
          gender: values.gender,
          emailAddress: values.emailAddress,
          phoneNumber: values.phoneNumber,
        };

        req = await saveProfile(payload);
      } else {
        req = await saveProfile(values);
      }

      if (!req.success) {
        toast.error(req.error);
        return;
      }

      toast.success("Profile submitted successfully");
    },
  });

  const calculateProgress = () => {
    let completed = 0;
    for (const value of Object.values(formik.values)) {
      if (typeof value === "string" && value !== "") completed++;
    }
    return Math.floor((completed / Object.keys(formik.values).length) * 100);
  };

  const progress = calculateProgress();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "No file chosen");
  };

  return (
    <div className={styles.page}>
      <form onSubmit={formik.handleSubmit}>
        {/* ── Hero Banner ── */}
        <div className={styles.heroBanner}>
          <div className={styles.heroLeft}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarRing}>
                <Image
                  src="/profile.png"
                  alt="Profile"
                  width={68}
                  height={68}
                  className={styles.avatarImg}
                />
              </div>
              <div
                className={styles.avatarEdit}
                onClick={() => setIsModalOpen(true)}
                role="button"
                aria-label="Edit profile photo"
              >
                <Image
                  src="/editProfile.png"
                  alt="Edit"
                  width={14}
                  height={14}
                />
              </div>
            </div>
            <div className={styles.heroInfo}>
              <h1 className={styles.heroName}>My Profile </h1>
              <p className={styles.heroEmail}>{data?.email}</p>
            </div>
          </div>

          <div className={styles.progressPill}>
            <p className={styles.progressLabel}>Profile Completion</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={styles.progressPct}>{progress}%</p>
            <p className={styles.progressSub}>Complete your profile</p>
          </div>
        </div>

        {/* ── Personal Information ── */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderIcon}>
              <LuUser size={24} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Personal Information</h2>
              <p className={styles.cardSubtitle}>
                Your basic details and contact info
              </p>
            </div>
          </div>

          <div className={styles.inputGrid}>
            <Field
              label="Postal Address"
              icon={<LuMapPin size={18} />}
              required
            >
              <input
                className={styles.input}
                placeholder="Enter postal address"
                {...formik.getFieldProps("postalAddress")}
              />
            </Field>

            <Field
              label="Date of Birth"
              icon={<LuCalendar size={18} />}
              required
            >
              <input
                className={styles.input}
                type="date"
                {...formik.getFieldProps("birthday")}
              />
            </Field>

            <Field label="Gender" icon={<LuUser size={18} />} required>
              <select
                className={styles.select}
                {...formik.getFieldProps("gender")}
              >
                <option value="">Select gender</option>
                {genderOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Email Address" icon={<LuMail size={18} />} required>
              <input
                className={styles.input}
                type="email"
                placeholder="Enter email address"
                {...formik.getFieldProps("emailAddress")}
              />
            </Field>

            <Field label="Phone Number" icon={<LuPhone size={18} />} required>
              <input
                className={styles.input}
                type="tel"
                placeholder="Enter phone number"
                {...formik.getFieldProps("phoneNumber")}
              />
            </Field>
          </div>
        </div>

        {/* ── Next of Kin ── */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardHeaderIcon} ${styles.green}`}>
              <LuUsers size={24} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Next of Kin</h2>
              <p className={styles.cardSubtitle}>Emergency contact details</p>
            </div>
          </div>

          <div className={styles.inputGrid}>
            <Field label="First Name" icon={<LuUser size={18} />} required>
              <input
                className={styles.input}
                placeholder="First name"
                disabled={!!data.nextOfKinFirstName}
                {...formik.getFieldProps("nextOfKinFirstName")}
              />
            </Field>

            <Field label="Last Name" icon={<LuUser size={18} />} required>
              <input
                className={styles.input}
                placeholder="Last name"
                disabled={!!data.nextOfKinLastName}
                {...formik.getFieldProps("nextOfKinLastName")}
              />
            </Field>

            <Field label="Email Address" icon={<LuMail size={18} />} required>
              <input
                className={styles.input}
                type="email"
                placeholder="Their email address"
                disabled={!!data.nextOfKinEmail}
                {...formik.getFieldProps("nextOfKinEmail")}
              />
            </Field>

            <Field label="Phone Number" icon={<LuPhone size={18} />} required>
              <input
                className={styles.input}
                type="tel"
                placeholder="Their phone number"
                disabled={!!data.nextOfKinPhoneNumber}
                {...formik.getFieldProps("nextOfKinPhoneNumber")}
              />
            </Field>

            <Field label="Relationship" icon={<LuLink size={18} />} required>
              <select
                className={styles.select}
                {...formik.getFieldProps("relationship")}
                disabled={!!data.nextOfKinRelationship}
              >
                <option value="">Who are they to you?</option>
                {relationshipOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Submit */}
        <div className={styles.submitRow}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving…" : "Save Changes →"}
          </button>
        </div>
      </form>

      {/* ── Change Photo Modal ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <button
          type="button"
          className={styles.modalClose}
          onClick={() => setIsModalOpen(false)}
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2 className={styles.modalTitle}>Update Profile Photo</h2>
        <p className={styles.modalSub}>Choose a clear, high-quality photo</p>
        <label className={styles.fileInputWrap} htmlFor="profileInput">
          <span className={styles.fileChooseBtn}>Choose File</span>
          <span className={styles.fileName}>{fileName}</span>
          <input
            id="profileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
        <button
          type="button"
          className={styles.submitBtn}
          style={{ width: "100%", justifyContent: "center" }}
        >
          Upload Photo
        </button>
      </Modal>
    </div>
  );
};

export default Profile;
