import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";

const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
export default HomeLayout;
