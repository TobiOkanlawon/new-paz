type Props = {
  message?: string;
  retryFunction?: () => void;
};

// shows the message on the screen and has a function to let the user retry, or go to the home page
export const ErrorComponent: React.FC<Props> = ({
  message = "An error occurred",
  retryFunction = () => {},
}) => {
  return <>{message}</>;
};
