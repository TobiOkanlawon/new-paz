// the User Object as represented by the backend and used in our application
type TUser = {
  firstName: string;
  lastName: string;
  email: string;
};

type TRegister = {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

type TRegisterData = {
  "User created": string;
  responseCode: string;
  responseMessage: string;
  user: TUser;
};
