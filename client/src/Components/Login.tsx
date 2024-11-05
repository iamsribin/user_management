import { Formik, Form, Field, ErrorMessage } from "formik";
import { SignIngValidation } from "../FormValidation/SignIngValidation";
import axios from "../Axios/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/features/userSlice";
import { useState } from "react";
import Loading from "./Loading";
import GoogleAuth from "./GoogleAuthe";
import webdeveloper_img from "../assets/website-developer.jpg";
import siginImg from '../assets/signin2.png'
interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

interface LoginData {
  email: string;
  password: string;
}
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlesubmit = async (loginData: LoginData) => {
    try {
      console.log("userDataaaasssss", loginData);
      const response = await axios.post("/login", loginData);
      // console.log("🚀 ~ file: Login.tsx:21 ~ handlesubmit ~ response:", response)
      if (response.data.success) {
        setLoading(true);
        toast.success("successfully");
        const UserResponse = await axios.get("/fetch-user-data");
        // console.log("🚀 ~ file: Login.tsx:31 ~ handlesubmit ~ UserResponse:", UserResponse)
        dispatch(setUserData(UserResponse.data));
        navigate("/");
        setLoading(false);
      } else if (response.data.Emailerror) {
        toast.error("email is not correct");
      } else if (response.data.PasswordError) {
        toast.error("password des not match");
      } else if (response.data.statusBlock) {
        toast.error("Admin block this Account");
      }else{
        toast.error("somthing went wrong");
      }
    } catch (Err) {
      console.log("mistake in login page", Err);
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        <div className="flex flex-1 justify-center items-center bg-blue-500 p-10">
          <div className="max-w-md w-full space-y-8">
            {loading && <Loading />}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Sign In
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={SignIngValidation}
              onSubmit={handlesubmit}
            >
              <Form>
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:bg-white focus:border-red-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="mb-4">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:bg-white focus:border-red-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600 mb-4"
                >
                  Sign In
                </button>
              </Form>
            </Formik>
            <p className="text-sm text-black-600 text-center">
              Don't have an account?{" "}
              <span
                className=" text-xl text-white-500 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
            <br />
            {/* <GoogleAuth /> */}
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 flex justify-center items-center">
          <img
            src={siginImg}
            alt="Web Developer"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
