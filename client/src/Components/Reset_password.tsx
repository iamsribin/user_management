import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { resetPasswordValidationSchema } from "../FormValidation/ResetPassword"; // Ensure this path is correct

type SubmitForm = {
  currentpassword: string;
  password: string;
  cpassword: string;
};

const handleSubmit = (values: SubmitForm) => {
  console.log(values);
};

const ResetPassword = () => {
  return (
    <div className="mb-4">
      <Formik
        initialValues={{
          currentpassword: "",
          password: "",
          cpassword: "",
        }}
        validationSchema={resetPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Change Password
              </label>
              <Field
                type="password"
                name="currentpassword"
                className="px-4 py-2 border rounded-md w-full mb-2"
                placeholder="Old Password"
              />
              <ErrorMessage
                name="currentpassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-2">
              <Field
                type="password"
                name="password"
                className="px-4 py-2 border rounded-md w-full mb-2"
                placeholder="New Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-2">
              <Field
                type="password"
                name="cpassword"
                className="px-4 py-2 border rounded-md w-full mb-2"
                placeholder="Confirm Password"
              />
              <ErrorMessage
                name="cpassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
