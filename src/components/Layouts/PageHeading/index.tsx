/* This component provides a consistent page heading with provisions for title and subtitle. It's meant to be used to quickly scaffold a normal type page on the paz application */

import styles from "./pageHeading.module.css";
import Button from "@/components/Button";

type BaseHeadingProps = {
  title: string;
  description: string;
  rightSide: React.ReactNode;
};

type Props = {
  buttonText?: string;
  onClick: () => void;
} & BaseHeadingProps;

export const BasePageHeading: React.FC<BaseHeadingProps> = ({
  title,
  description,
  rightSide,
}) => {
  return (
    <div className={styles.headingContainer}>
      <div className={styles.textContainer}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {rightSide}
    </div>
  );
};

/* This page heading assumes that there's a single button on the right side and has props with that assumption. It's a higher-order component. Underneath, it uses the BasePageHeading component */
const PageHeading: React.FC<Props> = ({
  title,
  description,
  buttonText,
  onClick,
}) => {
  return (
    <BasePageHeading
      title={title}
      description={description}
      rightSide={
        <div className={styles.buttonContainer}>
          {buttonText && <Button onClick={onClick}>{buttonText}</Button>}
        </div>
      }
    />
  );
};

export default PageHeading;
