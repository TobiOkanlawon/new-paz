import { LuCopy } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./styles.module.css";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Pill from "../Pill";
import Button from "@/components/Button";
import { useCreateFamilySavings } from "@/data/mutations/useCreateFamilySavings";
import { useGetWallet } from "@/data/queries/useGetWallet";
import useUser from "@/store/userStore";
import { Loading } from "../Loading";
import { ErrorComponent } from "../Error";

type Props = {
  isActive: boolean;
  handleCloseModal: () => void;
};

// Validation Schema
const validationSchema = Yup.object({
  familyName: Yup.string()
    .min(2, "Family name must be at least 2 characters")
    .required("Family name is required"),
  targetAmount: Yup.number()
    .min(1000, "Amount must be at least ₦1,000")
    .required("Please select or enter an amount"),
  savingFrequency: Yup.string().required("Please select saving frequency"),
  savingsDuration: Yup.string().required("Please select savings duration"),
  customDuration: Yup.number()
    .nullable()
    .when("savingsDuration", {
      is: (val: string) => !val || val === "custom",
      then: (schema) => schema.min(1, "Duration must be at least 1 month"),
    }),
});

const FamilyVaultModal: React.FC<Props> = ({ isActive, handleCloseModal }) => {
  const mutation = useCreateFamilySavings();
  const { user } = useUser();

  const { isLoading, data, error } = useGetWallet(user?.email as string);

  const targetAmounts = [5000, 10000, 50000, 100000];
  const savingsDurations = ["6 months", "1 year", "2 years", "5 years"];

  const formik = useFormik({
    initialValues: {
      familyName: "",
      targetAmount: 0,
      savingFrequency: "",
      savingsDuration: "",
      customDuration: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      mutation.mutate({
        title: values.familyName,
        targetAmount: values.targetAmount,
        frequency: values.savingFrequency,
        duration: values.customDuration || values.savingsDuration,
        walletId: data?.walletId as string,
        type: "FAMILYVAULT",
      });
      handleCloseModal();
    },
  });

  const handleCopyLink = () => {
    // Implement copy link functionality
    console.log("Copy link clicked");
  };

  return (
    <Modal isOpen={isActive} onClose={handleCloseModal}>
      <form className={styles.modalContainer} onSubmit={formik.handleSubmit}>
        <div className={styles.modalHeader}>
          <h1>PAZ Family Vault</h1>
          <p>Begin your journey to financial freedom</p>
        </div>

        <div className={styles.formContent}>
          <div className={styles.formGroup}>
            <Input
              id="familyName"
              type="text"
              label="Enter your family name"
              placeholder="Enter your family name"
              value={formik.values.familyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.familyName && formik.errors.familyName && (
              <div className={styles.errorText}>{formik.errors.familyName}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.addFamilyMemberInstruction}>
              <button
                type="button"
                className={styles.copyLinkButton}
                onClick={handleCopyLink}
              >
                <LuCopy /> Copy link
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Select preferred amount"
              type="number"
              id="preferredAmount"
              placeholder="Or specify amount"
              {...formik.getFieldProps("amount")}
            />
            <div className={styles.pillContainer}>
              {targetAmounts.map((amount) => (
                <Pill
                  key={`amount-${amount}`}
                  handleClick={() => {
                    formik.setFieldValue("targetAmount", amount);
                  }}
                  content={new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(amount)}
                  isActive={formik.values.targetAmount === amount}
                />
              ))}
            </div>
            <Input
              type="number"
              id="targetAmount"
              placeholder="Or specify amount"
              label="Target Amount"
              value={formik.values.targetAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.targetAmount && formik.errors.targetAmount && (
              <div className={styles.errorText}>
                {formik.errors.targetAmount}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="savingFrequency">Select Saving Frequency</label>
            <select
              name="savingFrequency"
              id="savingFrequency"
              className={styles.selectInput}
              value={formik.values.savingFrequency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select frequency</option>
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
              <option value="4 months">4 months</option>
              <option value="5 months">5 months</option>
              <option value="6 months">6 months</option>
            </select>
            {formik.touched.savingFrequency &&
              formik.errors.savingFrequency && (
                <div className={styles.errorText}>
                  {formik.errors.savingFrequency}
                </div>
              )}
          </div>

          <div className={styles.formGroup}>
            <label>Select savings duration</label>
            <div className={styles.pillContainer}>
              {savingsDurations.map((duration) => (
                <Pill
                  key={duration}
                  handleClick={() => {
                    formik.setFieldValue("savingsDuration", duration);
                  }}
                  content={duration}
                  isActive={formik.values.savingsDuration === duration}
                />
              ))}
            </div>
            <Input
              type="number"
              id="customDuration"
              placeholder="Or specify duration"
              label="Custom Duration"
              value={formik.values.customDuration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.savingsDuration &&
              formik.errors.savingsDuration && (
                <div className={styles.errorText}>
                  {formik.errors.savingsDuration}
                </div>
              )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button
            type="submit"
            className={styles.submitButton}
            disabled={formik.isSubmitting}
          >
            Create Savings
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FamilyVaultModal;
