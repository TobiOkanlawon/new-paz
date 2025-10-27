import Modal from "@/components/Modal";
import styles from "./styles.module.css";
import Input from "@/components/Input";
import Pill from "../Pill";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleErrorDisplay } from "@/libs/helpers";
import Button from "@/components/Button";
import { useCreateTargetSavings } from "@/data/mutations/useCreateTargetSavings";
import { useGetWallet } from "@/data/queries/useGetWallet";
import useUser from "@/store/userStore";
import { Loading } from "../Loading";
import { ErrorComponent } from "../Error";

type Props = {
  isActive: boolean;
  handleCloseModal: () => void;
};

// Updated schema to correctly validate all fields
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
  savingsFrequency: Yup.string().required("Please select a frequency"),
  savingsDuration: Yup.string().required("Please select a duration"), // Matched to pill values
  targetAmount: Yup.number()
    .required("You have to set a target")
    .positive("You can't have a negative target"),
});

const TargetSavingsModal: React.FC<Props> = ({
  isActive,
  handleCloseModal,
}) => {
  const mutation = useCreateTargetSavings();
  const { user } = useUser();

  const { isLoading, data, error } = useGetWallet(user?.email as string);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      regularSavingsAmount: 0,
      savingsFrequency: "Monthly", // Set a sensible default
      savingsDuration: "",
      targetAmount: 0,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      mutation.mutate({
        title: values.title,
        description: values.description,
        duration: values.savingsDuration,
        frequency: values.savingsFrequency,
        walletId: data?.walletId as string,
        targetAmount: values.targetAmount,
        type: "TARGETSAVINGS",
        currentAmount: 0.0,
      });
      handleCloseModal();
    },
  });

  const regularSavingsAmounts = [5000, 10000, 50000, 100000];
  const targetAmounts = [5000, 10000, 50000, 100000];
  const savingsDurations = [
    "3 months",
    "6 months",
    "9 months",
    "1 year",
    "2 years",
  ];

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent message="" retryFunction={() => {}} />;

  return (
    <Modal isOpen={isActive} onClose={handleCloseModal}>
      <form
        action="POST"
        onSubmit={formik.handleSubmit}
        className={styles.modalContainer}
      >
        <div className={styles.modalHeader}>
          <h1>Create a Target Saver Plan</h1>
          <p>Begin your journey to financial freedom, step-by-step</p>
        </div>

        <div className={styles.formContent}>
          <div className={styles.formGroup}>
            <Input
              label="Savings Title"
              type="text"
              id="title"
              placeholder="e.g., New Laptop, Vacation Fund"
              {...formik.getFieldProps("title")}
              errors={handleErrorDisplay(formik, "title")}
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Savings Description"
              type="text"
              id="description"
              placeholder="Tell us about the purpose of this savings"
              {...formik.getFieldProps("description")}
              errors={handleErrorDisplay(formik, "description")}
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              label="How much will you save regularly?"
              type="number"
              id="regularSavingsAmount"
              {...formik.getFieldProps("regularSavingsAmount")}
              errors={handleErrorDisplay(formik, "regularSavingsAmount")}
            />
            <div className={styles.pillContainer}>
              {regularSavingsAmounts.map((amount) => (
                <Pill
                  key={`reg-${amount}`}
                  handleClick={() =>
                    formik.setFieldValue("regularSavingsAmount", amount)
                  }
                  content={new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(amount)}
                  isActive={formik.values.regularSavingsAmount === amount}
                />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <Input
              label="What is your target amount?"
              type="number"
              id="targetAmount"
              {...formik.getFieldProps("targetAmount")}
              errors={handleErrorDisplay(formik, "targetAmount")}
            />
            <div className={styles.pillContainer}>
              {targetAmounts.map((amount) => (
                <Pill
                  key={`target-${amount}`}
                  handleClick={() =>
                    formik.setFieldValue("targetAmount", amount)
                  }
                  content={new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(amount)}
                  isActive={formik.values.targetAmount === amount}
                />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="savingsFrequency">How often will you save?</label>
            <select
              id="savingsFrequency"
              {...formik.getFieldProps("savingsFrequency")}
              className={styles.selectInput}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label id="savingsDurationLabel">For how long?</label>
            <div
              className={styles.pillContainer}
              role="group"
              aria-labelledby="savingsDurationLabel"
            >
              {savingsDurations.map((duration) => (
                <Pill
                  key={duration}
                  handleClick={() =>
                    formik.setFieldValue("savingsDuration", duration)
                  }
                  content={duration}
                  isActive={formik.values.savingsDuration === duration}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button
            type="submit"
            className={styles.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Creating Plan..."
              : "Create Target Saver Plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TargetSavingsModal;
