import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "../Axios/Axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/features/userSlice";
import { useNavigate } from "react-router-dom";

const GoogleAuth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_CLIENT_ID;
  console.log("🚀 ~ file: GoogleAuthe.tsx:7 ~ clientId:", clientId);
  
  const loginWithgoogle = async (credentialResponse: any) => {    
    try {
      const token = credentialResponse?.credential;
      console.log(
        "🚀 ~ file: GoogleAuthe.tsx:10 ~ loginWithgoogle ~ token:",
        token
      );
      const response = await axios.post("/google-auth", { token });
      if (response.data.success) {
        console.log("success");
        const FetchuserData = await axios.get("/fetch-user-data");
        // console.log("🚀 ~ file: SignUp.tsx:35 ~ handleSubmit ~ FetchuserData:", FetchuserData)
        dispatch(setUserData(FetchuserData.data));
        navigate("/home");
      } else {
        console.error("Something problem in google", Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={loginWithgoogle}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
