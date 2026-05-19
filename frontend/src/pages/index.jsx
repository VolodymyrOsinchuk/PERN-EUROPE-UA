import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import ErrorPage from "./ErrorPage";

export { default as ErrorPage } from "./ErrorPage";
export { default as AdDetailPage } from "./public/AdDetailPage";
export { default as Ads } from "./public/Ads";
export { default as AdsManager } from "./AdsManager";
export { default as CategoryDetails } from "./CategoryDetails";
export { default as CategoryManager } from "./CategoryManager";
export { default as Contacts } from "./public/Contacts";
export { default as CreateAdPage } from "./profile/CreateAdPage";
export { default as Dashboard } from "./dashboard/Dashboard";
export { default as DashboardLayout } from "../layouts/DashboardLayout";
export { default as EditAdPage } from "./dashboard/EditAdPage";
export { default as Events } from "./Events";
export { default as EventsManager } from "./EventsManager";
export { default as Forum } from "./Forum";
export { default as Home } from "./Home";
export { default as HomeLayout } from "../layouts/HomeLayout";
export { default as Login } from "./Login";
export { default as News } from "./News";
export { default as Policy } from "./Policy";
export { default as Profile } from "./profile/Profile";
export { default as ProfileLayout } from "../layouts/ProfileLayout";
export { default as Publications } from "./Publications";
export { default as Register } from "./Register";
export { default as Users } from "./Users";
export { default as VerifyAccount } from "./VerifyAccount";
export { default as Landing } from "./Landing";
export { default as About } from "./About";
export { default as Stats } from "./Stats";
export { default as AllAds } from "./AllAds";
export { default as Admin } from "./dashboard/Admin";
export { default as EditUser } from "./dashboard/EditUser";
export { default as SubcategoryItem } from "../components/SubcategoryItem";
export { default as SubcategoryItem1 } from "../components/SubcategoryItem1";
export { default as Posts } from "./dashboard/Posts";
export { default as Settings } from "./dashboard/Settings";
export { default as NewsManager } from "./NewsManager";

// import ErrorBoundary from "../components/ErrorBoundary";

// // Wrap your routes with the ErrorBoundary
// const AppRoutes = () => (
//   <ErrorBoundary>
//     <Routes>{/* ...existing routes... */}</Routes>
//   </ErrorBoundary>
// );

// export default AppRoutes;

const AppRoutes = () => (
  <Routes>
    {/* Exemple de route */}
    <Route path="/" element={<Home />} errorElement={<ErrorPage />} />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);

export default AppRoutes;
