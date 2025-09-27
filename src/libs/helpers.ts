export function handleErrorDisplay(formik, name) {
  /* This function takes in the formik object, figures out if the input named with the parameter `name` has been touched and then it decides to show its error or not, depending on if it has been touched and if it has an error*/

  if (!formik.touched[name]) return;
  if (!formik.errors[name]) return;

  return formik.errors[name];
}

export const formatBirthday = (birthdayInput: string) => {
  /* This function takes the birthday string in the form yyyy-mm-dd and turns it to the form dd/mm/yyyy*/

  if (birthdayInput === "") return ""
  const splitString = birthdayInput.split("-")
  if (splitString.length !== 3) return ""
  return `${splitString[2]}/${splitString[1]}/${splitString[0]}`
}
