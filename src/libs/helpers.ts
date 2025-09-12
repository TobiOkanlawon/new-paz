export function handleErrorDisplay(formik, name) {
  /* This function takes in the formik object, figures out if the input named with the parameter `name` has been touched and then it decides to show its error or not, depending on if it has been touched and if it has an error*/

  if (!formik.touched[name]) return;
  if (!formik.errors[name]) return;

  return formik.errors[name];
}
