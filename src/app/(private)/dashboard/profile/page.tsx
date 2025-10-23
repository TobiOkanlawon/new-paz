"use client";
import React, { useState } from "react";
import styles from "./profile.module.css";
import Input from "@/components/Input";
import SelectGroup from "@/components/InputGroup/SelectGroup";
import DateInput from "@/components/dateInput/page";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Image from "next/image";
import { useGetProfile } from "@/data/queries/useGetProfile";
import useUser from "@/store/userStore";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";
import { useFormik } from "formik";
import * as Yup from "yup";
import { formatBirthdayToDateInputFormat } from "@/libs/helpers";
import { useUpdateProfile } from "@/data/mutations/useUpdateProfile";
import { toast } from "react-toastify";

const schema = Yup.object();

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const relationshipOptions = [
  { label: "Father", value: "father" },
  { label: "Mother", value: "mother" },
  { label: "Brother", value: "brother" },
  { label: "Sister", value: "sister" },
  { label: "Other", value: "other" },
];

type TProfileFormValues = {
  postalAddress: string;
  gender: Gender;
  birthday: string;
  emailAddress: string;
  phoneNumber: string;
  nextOfKinFirstName: string;
  nextOfKinLastName: string;
  nextOfKinEmail: string;
  nextOfKinPhoneNumber: string;
  relationship: string;
};

const Profile = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useGetProfile(user?.email as string);
  const { mutateAsync } = useUpdateProfile();
  const { isPending: isUpdating } = useUpdateProfile();

  const formik = useFormik<TProfileFormValues>({
    initialValues: {
      postalAddress: data?.address || "",
      birthday: formatBirthdayToDateInputFormat(data?.birthday) || "",
      gender: data?.gender || "male" || "female",
      emailAddress: data?.email || user?.email || "",
      phoneNumber: data?.phoneNumber || "",
      nextOfKinFirstName: data?.nextOfKinFirstName || "",
      nextOfKinLastName: data?.nextOfKinLastName || "",
      nextOfKinEmail: data?.nextOfKinEmail || "",
      nextOfKinPhoneNumber: data?.nextOfKinPhoneNumber || "",
      relationship: data?.nextOfKinRelationship || "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const formattedValues = {
          address: values.postalAddress,
          gender: values.gender,
          email: values.emailAddress,
          birthday: values.birthday,
          phoneNumber: values.phoneNumber,
          nextOfKinFirstName: values.nextOfKinFirstName,
          nextOfKinLastName: values.nextOfKinLastName,
          nextOfKinEmail: values.nextOfKinEmail,
          nextOfKinPhoneNumber: values.nextOfKinPhoneNumber,
          nextOfKinRelationship: values.relationship,
        };

        await toast.promise(
          mutateAsync(formattedValues),
          {
            pending: "Updating profile...",
            // success: "Profile updated successfully 🎉",
            error: "Failed to update profile 😢",
          },
          { theme: "colored" },
        );

        setIsSubmitted(true);
      } catch (error) {
        console.error("❌ Profile update failed:", error);
      }
    },

    enableReinitialize: true,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("myPhoto.png");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "myPhoto.png");
  };
  const [isActive, setIsActive] = useState(false);

  const calculateProgress = () => {
    let completed = 0;

    for (const value of Object.values(formik.values)) {
      if (typeof value == "string" && value !== "") {
        completed++;
        continue;
      }
    }

    console.log(completed, Object.keys(formik.values).length);

    const ratio = completed / Object.keys(formik.values).length;
    return ratio * 100;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent message="" retryFunction={() => {}} />;
  }

  return (
    <div>
      <form
        className={styles.container}
        onSubmit={formik.handleSubmit}
        id="CONTAINER"
      >
        <section className={styles.headers}>
          <div className={styles.profileContainer}>
            <div className={styles.profileWrapper}>
              <Image
                src={"/profile.png"}
                alt="Profile Image"
                width={60}
                height={60}
              />
            </div>
            <div className={styles.editProfileWrapper}>
              <Image
                src={"/editProfile.png"}
                alt="Profile Image"
                width={18}
                height={18}
                onClick={handleOpenModal}
              />
            </div>
          </div>
          <div className={styles.progressWrapper}>
            <ProgressBar progress={calculateProgress()} />
          </div>
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <h2 className={styles.modalHeader}>Change profile photo</h2>
            <div className={styles.profileInputContainer}>
              <label htmlFor="profileInput" className={styles.fakeButton}>
                Choose File
              </label>
              <span className={styles.fileName}>{fileName}</span>
              <Input
                label=""
                type="file"
                id="profileInput"
                className={styles.profileInput}
                {...formik.getFieldProps("profileInput")}
              />
            </div>
            <div className={styles.buttonContainer}></div>
            <Button
              label="Submit"
              loading={false}
              className={styles.profileButton}
            />
          </Modal>
        </section>
        <section className={styles.form1}>
          <div>
            <div className={styles.groupInputs}>
              <div className={styles.inputs}>
                <Input
                  id="postalAddress"
                  label="Postal Address"
                  placeholder="Enter postal address here"
                  type="text"
                  required
                  disabled={isSubmitted}
                  className={styles.postalAddress}
                  {...formik.getFieldProps("postalAddress")}
                />
              </div>
              <div className={styles.inputs}>
                <DateInput
                  label="Birthday"
                  placeholder="Select Date"
                  id="birthday"
                  icon={
                    <Image
                      src={"/inputBirthday.png"}
                      alt="Birthday"
                      width={20}
                      height={20}
                    />
                  }
                  type="date"
                  {...formik.getFieldProps("birthday")}
                  required
                />
              </div>
            </div>
            <div className={styles.groupInputs}>
              <div className={styles.inputs}>
                <SelectGroup
                  label="Gender"
                  // name="gender"
                  options={genderOptions}
                  placeholder="Select Date"
                  {...formik.getFieldProps("gender")} 
                />
              </div>
              <div className={styles.inputs}>
                <Input
                  label="Email"
                  placeholder="Enter email address"
                  id="email"
                  type="email"
                  required
                  disabled={isSubmitted}
                  {...formik.getFieldProps("emailAddress")}
                />
              </div>
            </div>
            <div className={styles.groupInputs}>
              <div className={styles.inputs}>
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  id="phoneNumber"
                  type="tel"
                  required
                  disabled={isSubmitted}
                  {...formik.getFieldProps("phoneNumber")}
                />
              </div>
              <div className={styles.inputs}></div>
            </div>
          </div>
        </section>
        <section className={styles.form2}>
          <h3>Next of Kin Details</h3>
          <div>
            <div className={styles.groupInputs}>
              <Input
                label="First Name"
                placeholder="Enter First Name"
                id="nextOfKinFirstName"
                type="text"
                required
                disabled={isSubmitted}
                {...formik.getFieldProps("nextOfKinFirstName")}
              />
              <Input
                label="Last Name"
                placeholder="Enter Last Name"
                id="nextOfKinLastName"
                type="text"
                required
                disabled={isSubmitted}
                {...formik.getFieldProps("nextOfKinLastName")}
              />
            </div>
            <div className={styles.groupInputs}>
              <Input
                id="nextOfKinEmail"
                label="Email"
                placeholder="Enter their email address"
                type="email"
                required
                disabled={isSubmitted}
                {...formik.getFieldProps("nextOfKinEmail")}
              />
              <Input
                label="Phone Number"
                placeholder="Enter their phone number"
                id="nextOfKinPhoneNumber"
                type="tel"
                required
                disabled={isSubmitted}
                {...formik.getFieldProps("nextOfKinPhoneNumber")}
              />
            </div>
            <div className={styles.groupInputs}>
              <div className={styles.inputs}>
                <SelectGroup
                  label="Relationship"
                  // name="relationship"
                  placeholder="Who is the person to you?"
                  options={relationshipOptions}
                  required
                  disabled={isSubmitted}
                  {...formik.getFieldProps("relationship")}
                />
              </div>
              <div className={styles.inputs}></div>
            </div>
          </div>
        </section>
        <Button
          label={isUpdating ? "Updating..." : "Submit"}
          loading={isUpdating}
          className={styles.button}
          type="submit"
        />
      </form>
    </div>
  );
};

export default Profile;
