import * as Yup from "yup";

export const resetPasswordValidationSchema = Yup.object({
  currentpassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Current password is required")
    .matches(/^\S*$/, "Password must not contain spaces"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required")
    .matches(/^\S*$/, "Password must not contain spaces"),
  cpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required")
    .matches(/^\S*$/, "Confirm password must not contain spaces"),
});
