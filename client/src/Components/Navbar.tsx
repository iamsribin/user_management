import { useDispatch } from "react-redux";
import axios from "../Axios/Axios";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../Redux/features/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = async () => {
    console.log("user logout");
    try {
      await axios
        .get("/logout")
        .then(() => {
          dispatch(setUserData(null));
          navigate("/login");
        })
        .catch((err) => {
          console.log("mistake in logout", err);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <nav className="bg-green-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-white text-xl font-bold"
          onClick={() => navigate("/home")}
        >
          Navbar
        </h1>
        <div className="flex space-x-4">
          <p className="text-white font-bold h-12 flex items-center hover:text-green-200 transition-colors duration-300">
            Profile
          </p>
          <p className="text-white font-bold h-12 flex items-center hover:text-green-200 transition-colors duration-300">
            Settings
          </p>
          <p
            className="text-white font-bold h-12 flex items-center hover:text-green-200 transition-colors duration-300"
            onClick={logout}
          >
            Logout
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
