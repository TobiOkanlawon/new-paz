import { FormikProps } from 'formik';

export function handleErrorDisplay<T>(formik: FormikProps<T>, name: keyof T): string | undefined {
  /* This function takes in the formik object, figures out if the input named with the parameter `name` has been touched and then it decides to show its error or not, depending on if it has been touched and if it has an error*/

  if (!formik.touched[name]) return undefined;
  if (!formik.errors[name]) return undefined;

  return formik.errors[name] as string;
}

export const formatBirthdayToBackendFormat = (
  birthdayInput: string | undefined,
) => {
  /*

This function takes the birthday string in the form yyyy-mm-dd and turns it to the form dd/mm/yyyy

    if the birthdayInput is undefined, it returns undefined
   */

  if (!birthdayInput) return undefined;

  if (birthdayInput === "") return "";
  const splitString = birthdayInput.split("-");
  if (splitString.length !== 3) return "";
  return `${splitString[2]}/${splitString[1]}/${splitString[0]}`;
};

export const formatBirthdayToDateInputFormat = (
  dateFromBackend: string | undefined,
) => {
  /* This function takes a birthday string in the form dd/mm/yyyy and transforms it to the form yyyy-mm-dd */

  if (!dateFromBackend) return undefined;

  if (dateFromBackend === "") return "";
  const splitString = dateFromBackend.split("/");
  if (splitString.length !== 3) return "";
  return `${splitString[2]}-${splitString[1]}-${splitString[0]}`;
};
