import * as yup from 'yup';

export const RegisterSchema = yup.object({
  firstName: yup
    .string()
    .required("You must specify a first name")
    .min(2, "This first name doesn't seem valid")
    .max(32, "You're first name cannot be longer than 32 characters"),
  lastName: yup
    .string()
    .required("You must specify a last name")
    .min(2, "This last name doesn't seem valid")
    .max(32, "You're last name cannot be longer than 32 characters"),
  phoneNumber: yup
    .string()
    .length(11, "You must specify a valid phone number")
    .required("You must specify a phone number"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("You must specify an email"),
  password: yup
    .string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character",
    ),
  confirmPassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});
