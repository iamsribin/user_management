import { useEffect, useRef, useState } from "react";
import Navbar from "../../Components/Navbar";
import Reset_password from "../../Components/Reset_password";
import profiler_img from "../../assets/img-23.avif";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../Redux/features/userSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { editProfileValidationSchema } from "../../FormValidation/ProfileValidation";
import axios from "../../Axios/Axios";
import { toast } from "react-toastify";
import defaultProfileImage from "../../assets/monkey.jpg";
import { CustomImageFileInput } from "../../Components/imageField";
import { resetPasswordValidationSchema } from "../../FormValidation/ResetPassword";

interface initialValuesType {
  username: string;
  bio: string;
}
const initialValues: initialValuesType = {
  username: "",
  bio: "",
};

interface fromTyep {
  username: string;
  email: string;
  image?: string | null;
  bio: string;
}
type Users = {
  _id?: string;
  name: string;
  email: string;
  bio: string;
  profile: string | null;
};
type SubmitForm = {
  currentpassword: string;
  password: string;
  cpassword: string;
};
interface Image {
  image: string | File | null;
}
const Profile = () => {
  const [showpassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.UserData.userData);
  const [images, setImage] = useState<string | null>(null);
  const userDetailFetch = useSelector((state: any) => state.UserData.userData);

  const profileImage = userDetailFetch.profile
    ? userDetailFetch.profile
    : defaultProfileImage;
  // console.log("🚀 ~ file: Profile.tsx:27 ~ Profile ~ userData:", userData);

  useEffect(() => {
    if (userData) {
      setUserData({
        username: userData.name,
        email: userData.email,
        bio: userData.bio,
      });
    }
  }, [userData]);
  const handleEditForm = async (value: fromTyep, images: string | null) => {
    try {
      // console.log(value, images,"images is here");
      const formData = {
        username: value.username,
        email: value.email,
        bio: value.bio,
        images: images,
      };
      console.log(
        "🚀 ~ file: Profile.tsx:61 ~ handleEditForm ~ formData:",
        formData
      );
      // const newvalue = [value, images];
      const PostEditProfile = await axios.post("/edit-profile-form", formData);
      if (PostEditProfile.data.success) {
        const userGetData = await axios.get("/fetch-user-data");

        toast.success("ok");
        dispatch(setUserData(userGetData.data));
      } else {
        toast.error("showing error");
      }
      // console.log(Response, "jiji");
    } catch (err) {
      console.error("Error s");
    }
  };
  const handleDelete = async (value: string) => {
    try {
      console.log(value, "this is the id");
      const deleteImg = await axios.post("/delete-img", { id: value });
      if (deleteImg.data.success) {
        const userAfter = await axios.get("/fetch-user-data");
        toast.success("Deleted successfully");
        dispatch(setUserData(userAfter.data));
      } else {
        toast.error("Something wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditPassword = async (value: SubmitForm) => {
    console.log("hey", value);
    try {
      const FormData = {
        oldpasswordd: value.currentpassword,
        password: value.password,
        confirm: value.cpassword,
        email: userData.email,
      };
      const changepassword = await axios.post("/change-password", FormData);
      if (changepassword.data.success) {
        const userAfter = await axios.get("/fetch-user-data");
        toast.success("Change successfully");
        dispatch(setUserData(userAfter.data));
      } else if (changepassword.data.NotMach) {
        toast.error("Password des not match");
      } else if (changepassword.data.Usernotget) {
        toast.error("Somthing Problem Connect Admin");
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(images, "kokoo");

  const handleImageChange = (file: string | File | null) => {
    if (typeof file === "string" || file === null) {
      setImage(file);
    } else {
      console.error("Received unexpected file type:", file);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="max-w-3xl w-full p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3">
              <img
                src={profileImage}
                className="items-center border-spacing-7 rounded-md"
                alt="Profile"
              />
            </div>
            {/* <input
              type="file"
              ref={inputProfileRef}
              accept="image/*"
              className="hidden"
              onChange={handle_Profile_input}
            /> */}
            {/* <CustomImageFileInput onChange={handleImageChange} /> */}

            <div className="w-1/2">
              <Formik
                initialValues={{
                  username: userData.name,
                  email: userData.email,

                  bio: userData.bio,
                }}
                validationSchema={editProfileValidationSchema}
                onSubmit={(values) => handleEditForm(values, images)}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col">
                    <div className="mb-4">
                      {/* <Field
                        type="hidden"
                        name="image"
                        value={images || ""}
                        className="px-4 py-2 mb-2 border rounded-md w-full "
                      /> */}
                      <Field
                        type="text"
                        name="email"
                        className="px-4 py-2 mb-2 border rounded-md w-full "
                        placeholder="New Username"
                        readOnly
                      />
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Change Username
                      </label>
                      <Field
                        type="text"
                        name="username"
                        className="px-4 py-2 mb-2 border rounded-md w-full"
                        placeholder="New Username"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                      <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                        Add Bio
                      </label>
                      <Field
                        type="text"
                        name="bio"
                        className="px-4 py-2 mb-2 border rounded-md w-full"
                        placeholder="Add Bio"
                      />
                      <ErrorMessage
                        name="bio"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <p
                onClick={() => setShowPassword(!showpassword)}
                className="text-red-700"
              >
                ChangePassword
              </p>
              <br />

              {showpassword && (
                <Formik
                  initialValues={{
                    currentpassword: "",
                    password: "",
                    cpassword: "",
                  }}
                  validationSchema={resetPasswordValidationSchema}
                  onSubmit={handleEditPassword}
                >
                  <Form className="flex flex-col">
                    <div className="mb-4">
                      {/* <Field
                        type="text"
                        name="currentpassword"
                        className="px-4 py-2 mb-2 border rounded-md w-full hidden "
                        placeholder="New Username"
                      /> */}
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Current Password
                      </label>
                      <Field
                        type="password"
                        name="currentpassword"
                        className="px-4 py-2 mb-2 border rounded-md w-full"
                        placeholder="Enter your current Password"
                      />
                      <ErrorMessage
                        name="currentpassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                      <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                        New Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="px-4 py-2 mb-2 border rounded-md w-full"
                        placeholder="Password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                      <Field
                        type="password"
                        name="cpassword"
                        className="px-4 py-2 mb-2 border rounded-md w-full"
                        placeholder="Confirm-Password"
                      />
                      <ErrorMessage
                        name="cpassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Formik>
              )}
            </div>
          </div>

          {/* <button
            className="px-4 py-2 mr-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleEditProfile}
          >
            Edit
          </button> */}
          <CustomImageFileInput onChange={handleImageChange} />
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleDelete(userDetailFetch._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
