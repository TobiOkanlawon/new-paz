import Modal from "@/components/Modal";
import styles from "./styles.module.css";
import Input from "@/components/Input";
import Pill from "../Pill";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleErrorDisplay } from "@/libs/helpers";
import Button from "@/components/Button";
import { useCreateTargetSavings } from "@/data/mutations/useCreateTargetSavings";
import { useWallet } from "@/store/walletStore";

type Props = {
  isActive: boolean;
  handleCloseModal: () => void;
};

const schema = Yup.object({
  title: Yup.string()
    .required("You have to specify a title for you plan")
    .max(64, "The title is too long"),
  description: Yup.string()
    .required("You have to specify a description for your plan")
    .min(3, "Describe it a bit more"),
  regularSavingsAmount: Yup.number()
    .positive("You can't have a negative regular savings amount")
    .min(1000, "Your savings amount must be 1000 or higher"),
  savingsFrequency: Yup.string(),
  savingsDuration: Yup.number(),
  targetAmount: Yup.number()
    .required("You have to set a target")
    .positive("You can't have a negative target"),
});

const TargetSavingsModal: React.FC<Props> = ({
  isActive,
  handleCloseModal,
}) => {
  const mutation = useCreateTargetSavings();
  const { walletInformation } = useWallet();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      regularSavingsAmount: 0,
      savingsFrequency: "Monthly",
      savingsDuration: 0,
      targetAmount: 0,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      handleCloseModal();
      return mutation.mutate({
        title: values.title,
        description: values.description,
        // duration: values.savingsDuration,
        // frequency: values.savingsFrequency,
        duration: "6 months",
        walletId: walletInformation?.walletId as string,
        targetAmount: values.targetAmount,
        frequency: "Monthly",
        type: "TARGETSAVINGS",
        currentAmount: 0.0,
      });
    },
  });

  const regularSavingsAmounts = [
    {
      id: 1,
      amount: 5000,
      handleClick: () => {
        formik.setFieldValue("regularSavingsAmount", 5000);
      },
    },
    {
      id: 2,
      amount: 10000,
      handleClick: () => {
        formik.setFieldValue("regularSavingsAmount", 10000);
      },
    },
    {
      id: 3,
      amount: 50000,
      handleClick: () => {
        formik.setFieldValue("regularSavingsAmount", 50000);
      },
    },
    {
      id: 4,
      amount: 100000,
      handleClick: () => {
        formik.setFieldValue("regularSavingsAmount", 100000);
      },
    },
  ];

  const targetAmounts = [
    {
      id: 1,
      amount: 5000,
      handleClick: () => {
        formik.setFieldValue("targetAmount", 5000);
      },
    },
    {
      id: 2,
      amount: 10000,
      handleClick: () => {
        formik.setFieldValue("targetAmount", 10000);
      },
    },
    {
      id: 3,
      amount: 50000,
      handleClick: () => {
        formik.setFieldValue("targetAmount", 50000);
      },
    },
    {
      id: 4,
      amount: 100000,
      handleClick: () => {
        formik.setFieldValue("targetAmount", 100000);
      },
    },
  ];

  const savingsDurations = [
    {
      id: 2,
      duration: "3 months",
      handleClick: () => formik.setFieldValue("savingDuration", "3 months"),
    },
    {
      id: 1,
      duration: "6 months",
      handleClick: () => formik.setFieldValue("savingDuration", "6 months"),
    },

    {
      id: 3,
      duration: "9 months",
      handleClick: () => formik.setFieldValue("savingDuration", "9 months"),
    },

    {
      id: 4,
      duration: "1 year",
      handleClick: () => formik.setFieldValue("savingDuration", "1 year"),
    },

    {
      id: 5,
      duration: "2 years",
      handleClick: () => formik.setFieldValue("savingDuration", "2 years"),
    },
  ];

  return (
    <Modal isOpen={isActive} onClose={handleCloseModal}>
      <form
        action="POST"
        onSubmit={formik.handleSubmit}
        className={styles.modalContainer}
      >
        <h1>Create a Target Saver Plan</h1>
        <p>Begin your journey to financial freedom, step-by-step</p>
        <Input
          label="Savings Title"
          type="text"
          id="title"
          placeholder="What are you saving towards"
          {...formik.getFieldProps("title")}
          errors={handleErrorDisplay(formik, "title")}
        />
        <Input
          label="Savings Description*"
          type="text"
          id="description"
          style={{ width: "100%" }}
          placeholder="Tell us about your purpose of this savings"
          {...formik.getFieldProps("description")}
          errors={handleErrorDisplay(formik, "description")}
        />

        <div className={styles.regularSavingsAmount}>
          <Input
            label="Specify an amount to save regularly"
            type="number"
            id="regularSavingsAmount"
            placeholder="Specify amount to save regularly"
            {...formik.getFieldProps("regularSavingsAmount")}
            errors={handleErrorDisplay(formik, "regularSavingsAmount")}
          />
          <div className={styles.pillContainer}>
            {regularSavingsAmounts.map((p) => {
              return (
                <Pill
                  key={p.id}
                  handleClick={p.handleClick}
                  content={new Intl.NumberFormat("en-US").format(p.amount)}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.regularSavingsAmount}>
          <Input
            label="Specify a target amount"
            type="number"
            id="targetAmount"
            placeholder="Specify amount to save regularly"
            {...formik.getFieldProps("targetAmount")}
            errors={handleErrorDisplay(formik, "targetAmount")}
          />
          <div className={styles.pillContainer}>
            {targetAmounts.map((p) => {
              return (
                <Pill
                  key={p.id}
                  handleClick={p.handleClick}
                  content={new Intl.NumberFormat("en-US").format(p.amount)}
                />
              );
            })}
          </div>
        </div>
        <label htmlFor="savingFrequency">Select Saving Frequency</label>
        <div className={styles.frequentSavings}>
          <select name="savingFrequency" id="savingFrequency">
            <option value="2 months">2 months</option>
            <option value="3 months">3 months</option>
            <option value="4 months">4 months</option>
            <option value="5 months">5 months</option>
            <option value="6 months">6 months</option>
          </select>
        </div>
        <Input
          label="Select savings duration"
          type="number"
          name="preferredAmount"
          id="preferredAmount"
          placeholder="Specify Duration"
        />
        <div className={styles.pillContainer}>
          {savingsDurations.map((s) => {
            return (
              <Pill
                key={s.id}
                handleClick={s.handleClick}
                content={s.duration}
              />
            );
          })}
        </div>

        <Button type="submit" className={styles.submitButton}>
          Create Target Saver Plan
        </Button>
      </form>
    </Modal>
  );
};

export default TargetSavingsModal;
