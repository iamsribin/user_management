import * as Yup from "yup";

export const editUserNameValidationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .matches(/^\S*$/, "Username must not contain spaces")
    .matches(/^[^\d]*$/, "Username must not contain numbers"),
});
