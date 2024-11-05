import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
// import profiler_img from "../../assets/img-23.avif";

import { useSelector } from "react-redux";
import defaultProfileImage from "../../assets/monkey.jpg";

const Home = () => {
  const navigate = useNavigate();
  const userDetailFetch = useSelector((state: any) => state.UserData.userData);

  const profileImage = userDetailFetch.profile?userDetailFetch.profile:defaultProfileImage
  

  console.log("🚀 ~ file: Home.tsx:13 ~ Home ~ profileImage:", profileImage);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
          <h1 className="font-bold text-xl mb-4">Welcome Home</h1>
          <img
            src={profileImage}
            className="items-center border-spacing-7 rounded-full"
            alt="mokey"
          />
          <button
            className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
            onClick={() => navigate("/profile")}
          >
            Click Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
