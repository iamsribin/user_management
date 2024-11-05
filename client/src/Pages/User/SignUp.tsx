import { Formik, Form, Field, ErrorMessage } from "formik";
import { SignUpValidation } from "../../FormValidation/SignUpValidation";
import axios from "../../Axios/Axios";
import { useState } from "react";
import { setUserData } from "../../Redux/features/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../Components/Loading";
import GoogleAuth from "../../Components/GoogleAuthe";
import website_developer from "../../assets/website-developer.jpg";
import singUP from '../../assets/singUp.webp';

interface singupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const initialValues: singupData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const disptach = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (userData: singupData) => {
    console.log("hee", userData);
    setLoading(true);
    const response = await axios.post("/Postsignup", userData);

    if (response.data.success) {
      console.log("success");
      const FetchuserData = await axios.get("/fetch-user-data");
      console.log("🚀 ~ file: SignUp.tsx:35 ~ handleSubmit ~ FetchuserData:", FetchuserData);
      disptach(setUserData(FetchuserData.data));

      navigate("/home");
      setTimeout(() => {
        setLoading(false);
      }, 2000);

    } else if (response.data.Error) {
      toast.error("user already exists ");
    }else{
      toast.error("somthing went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-blue-700   flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex flex-row items-center justify-center w-full">
        <div className="w-1/2 flex justify-center">
          <img
            src={singUP}
            alt="Website Developer"
            className="w-3/4 mx-auto"
          />
        </div>
        <div className="w-1/2">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {loading && <Loading />}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign up for an account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <Formik
              initialValues={initialValues}
              validationSchema={SignUpValidation}
              onSubmit={handleSubmit}
            >
              <Form className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Field
                    id="username"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your Password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign up
                  </button>
                </div>
              </Form>
            </Formik>

            {/* <GoogleAuth /> */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <p
                  className="text-center block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={() => navigate("/login")}>
                  Sign in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
