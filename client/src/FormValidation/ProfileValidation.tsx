import * as Yup from "yup";

export const editProfileValidationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .matches(/^\S*$/, "Username must not contain spaces"),
  bio: Yup.string().matches(
    /^(?!.* {3}).*$/,
    "Bio must not contain more than 2 consecutive spaces"
  ),
});
