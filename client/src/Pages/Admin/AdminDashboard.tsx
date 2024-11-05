import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Navbar from "../../Components/Navbar";
import axios from "../../Axios/Axios";
import { editUserNameValidationSchema } from "../../FormValidation/EditUsernameAdmin";
import { AddUserAdminSchema } from "../../FormValidation/AddUserAdminValidation";
import { AddUSerFrom } from "../../types/AddUserAdmin";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";

interface initialValuesType {
  username: string;
  email: string;
  bio?: string;
}
type User = {
  _id?: string;
  name: string;
  email: string;
}

const AdminDashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenAdd, setModalOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const debouncevalue=useDebounce(search,500);

  const initialValues: AddUSerFrom = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `/admin/fetch-user-admin${debouncevalue ? `?search=${debouncevalue}` : " "}`
        );
        const { data } = response;
        let userWithsearch: User[] = [];
        if (Array.isArray(data.data)) {
          userWithsearch = data.data.map((user: User, index: number) => ({
            ...user,
            id: index + 1,
          }));
        } else {
          console.error("Expected an array but received:", data);
        }
        setUserData(userWithsearch);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchUser();
  }, [debouncevalue]);
  // console.log(userData, "this is the data");
  // console.log(editingUserId, "get it");
  const selectedUser = userData.find((user) => user?._id === editingUserId);
  // console.log(
  //   "🚀 ~ file: AdminDashboard.tsx:29 ~ AdminDashboard ~ select_user:",
  //   selectedUser
  // );

  const handleEdituser = async (value: any) => {
    // console.log("hey working ", value);
    try {
      const newEdituser = await axios.post("/admin/edit-user", value);
      setModalOpen(false);
      const eidtuser = await axios.get("/admin/fetch-user-admin");
      console.log(
        "🚀 ~ file: AdminDashboard.tsx:65 ~ handleEdituser ~ eidtuser:",
        eidtuser
      );
      const { data } = eidtuser;
      let userAfterEdit: User[] = [];
      if (Array.isArray(data.data)) {
        userAfterEdit = data.data.map((user: User, index: number) => ({
          ...user,
          id: index + 1,
        }));
      } else {
        console.error("Error showing the edituser side", data);
      }
      setUserData(userAfterEdit);
      // console.log("🚀 ~ file: AdminDashboard.tsx:71 ~ handleEdituser ~ userAfterEdit:", userAfterEdit)
    } catch (err) {
      console.log(err);
    }
  };
  const handleAdduser = async (value: AddUSerFrom) => {
    console.log("working", value);
    const response = await axios.post("/admin/add-user-admin", value);
    if (response.data.success) {
      const newUser = await axios.get("/admin/fetch-user-admin");
      const { data } = newUser;
      let userAfterAdd: User[] = [];

      if (Array.isArray(data.data)) {
        userAfterAdd = data.data.map((user: User, index: number) => ({
          ...user,
          id: index + 1,
        }));
      }

      toast.success("successfully");
      setUserData(userAfterAdd);
      setModalOpenAdd(false);
    } else if (response.data.CheckError) {
      toast.error("the mail already used");
      setModalOpenAdd(true);
    }
  };
  const handleDelete = async (_id: string) => {
    console.log("user is id", _id);
    try {
      const userDetail = userData.find((item) => item._id === _id);
      const confirmDelete = window.confirm(
        `Are you user delete :${userDetail?.name}`
      );
      if (!confirmDelete) return;
      const response = await axios.post("/admin/delete-user-admin", {
        data: userDetail?._id,
      });
      if (response.data.success) {
        const newsUser = await axios.get("/admin/fetch-user-admin");
        const { data } = newsUser;
        let userAfterDelete: User[] = [];
        if (Array.isArray(data.data)) {
          userAfterDelete = data.data.map((user: User, index: number) => ({
            ...user,
            id: index + 1,
          }));
          toast.success("Successfuly");
          setUserData(userAfterDelete);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="flex flex-col items-center w-full py-10">
          <div className="flex justify-between items-center w-full max-w-4xl mb-6 px-4">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <input
              type="text"
              placeholder="Search..."
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setModalOpenAdd(true)}
            >
              Create
            </button>
          </div>

          <div className="overflow-x-auto w-full max-w-4xl">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-100 border-b border-gray-200 text-gray-600 font-bold uppercase text-sm text-left">
                    Username
                  </th>
                  <th className="py-3 px-6 bg-gray-100 border-b border-gray-200 text-gray-600 font-bold uppercase text-sm text-left">
                    Email
                  </th>
                  <th className="py-3 px-6 bg-gray-100 border-b border-gray-200 text-gray-600 font-bold uppercase text-sm text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user:any, index: number) => (
                  <tr key={user._id}>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {user.email}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                        onClick={() => {
                          setEditingUserId(user._id);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      {user.status == "Active" ? (
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(user._id)}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(user._id)}
                        >
                          Unblock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <Formik
              initialValues={{
                username: selectedUser?.name,
                email: selectedUser?.email,
              }}
              validationSchema={editUserNameValidationSchema}
              onSubmit={handleEdituser}
            >
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700">Username</label>
                  <Field
                    type="text"
                    name="username"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    readOnly
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-gray-700">Bio</label>
                  <Field
                    as="textarea"
                    name="bio"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="bio"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div> */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}
      {isModalOpenAdd && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add User</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={AddUserAdminSchema}
              onSubmit={handleAdduser}
            >
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700">Username</label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">password</label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">ConfirmPassword</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-gray-700">Bio</label>
                  <Field
                    as="textarea"
                    name="bio"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="bio"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div> */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                    onClick={() => setModalOpenAdd(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
