import { useFormik } from "formik";
import styles from "./styles.module.css";
import * as Yup from "yup";
import Modal from "../Modal";
import Input from "@/components/Input";
import SelectGroup from "@/components//InputGroup/SelectGroup";
import { handleErrorDisplay } from "@/libs/helpers";
import Button from "@/components/Button";
import { useApplyForLoan } from "@/data/mutations/useApplyForLoan";
import { useGetWallet } from "@/data/queries/useGetWallet";
import useUser from "@/store/userStore";
import { Loading } from "../Loading";
import { ErrorComponent } from "../Error";

type Props = {
  isModalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
};

const schema = Yup.object({
  purpose: Yup.string()
    .required("You must input a purpose to request a loan")
    .min(8, "Purpose is too short")
    .max(128, "Purpose is too long"),
  amount: Yup.number()
    .positive("You can't input a negative amount")
    .required("How much do you want to borrow?"),
  duration: Yup.mixed()
    .required("You must supply a duration")
    .oneOf(["3 months", "6 months", "9 months"]),
});

type LoanFormType = Yup.InferType<typeof schema>;

const LoanForm: React.FC<Props> = ({ isModalOpen, handleModalClose }) => {
  const mutation = useApplyForLoan();
  const { user } = useUser();
  const { data, isLoading, error } = useGetWallet(user?.email as string);
  const formik = useFormik<LoanFormType>({
    initialValues: {
      purpose: "",
      amount: 0,
      duration: "3 months",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      mutation.mutate(
        {
          walletId: data!.walletId as string,
          productName: "PayDay", // this is what the backend requests (hardcoded)
          amount: Number(values.amount),
          duration: values.duration as string,
          purpose: values.purpose,
        },
        {
          onSuccess: () => {
            handleModalClose();
          },
        },
      );
    },
  });

  if (isLoading) return <Loading />;

  if (error) return <ErrorComponent />;

  return (
    <Modal onClose={handleModalClose} isOpen={isModalOpen}>
      <h1 className={styles.modalTitle}>Instant Loan Application Form</h1>
      <p className={styles.modalDescription}>Get instant loan quick and easy</p>
      <form onSubmit={formik.handleSubmit} className={styles.modalForm}>
        <Input
          id="purpose"
          label="Purpose of loan"
          placeholder="Input loan purpose"
          {...formik.getFieldProps("purpose")}
          errors={handleErrorDisplay(formik, "purpose")}
        />
        <Input
          id="amount"
          label="Amount"
          placeholder="Enter how much you need"
          {...formik.getFieldProps("amount")}
          errors={handleErrorDisplay(formik, "amount")}
        />
        <SelectGroup
          id="duration"
          label="Loan duration"
          options={[
            { label: "3 months", value: "3 months" },
            { label: "6 months", value: "6 months" },
            { label: "9 months", value: "9 months" },
          ]}
          placeholder="Select loan duration"
          {...formik.getFieldProps("duration")}
          errors={handleErrorDisplay(formik, "duration")}
        />

        <div className={styles.modalButton}>
          <Button type="submit">Check Eligibility</Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoanForm;
