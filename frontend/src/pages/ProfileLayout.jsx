import { createContext, useContext } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users/current-user");
    return data;
  } catch (error) {
    console.log("🚀 ~ loader ~ error:", error);

    toast.error(error?.response?.data?.error || error?.response?.data?.message);
    return redirect("/login");
  }
};

const ProfileContext = createContext();
const ProfileLayout = () => {
  const user = useLoaderData();
  const navigate = useNavigate();

  const logoutUser = async () => {
    console.log("logged out user");
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logged out successfully...");
  };

  return (
    <ProfileContext.Provider value={{ user, logoutUser }}>
      <Outlet context={{ user }} />
    </ProfileContext.Provider>
  );
};
export const useProfileContext = () => useContext(ProfileContext);

export default ProfileLayout;
