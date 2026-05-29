// import { Route, Routes } from "react-router-dom";
// import ErrorBoundary from "../components/ErrorBoundary";
// import ErrorPage from "./ErrorPage";

// export { default as About } from "./About";
// export { default as AdDetailPage } from "./public/AdDetailPage";
// export { default as Admin } from "./dashboard/Admin";
// export { default as Ads } from "./public/Ads";
// export { default as AdsManager } from "./AdsManager";
// export { default as CategoryDetails } from "./CategoryDetails";
// export { default as CategoryManager } from "./CategoryManager";
// export { default as Contacts } from "./public/Contacts";
// export { default as CreateAdPage } from "./profile/CreateAdPage";
// export { default as Dashboard } from "./dashboard/Dashboard";
// export { default as DashboardLayout } from "../layouts/DashboardLayout";
// export { default as EditAdPage } from "./dashboard/EditAdPage";
// export { default as EditUser } from "./dashboard/EditUser";
// export { default as ErrorPage } from "./ErrorPage";
// export { default as Events } from "./Events";
// export { default as EventsManager } from "./EventsManager";
// export { default as Forum } from "./Forum";
// export { default as Home } from "./Home";
// export { default as HomeLayout } from "../layouts/HomeLayout";
// export { default as Landing } from "./Landing";
// export { default as Login } from "./Login";
// export { default as News } from "./News";
// export { default as NewsManager } from "./NewsManager";
// export { default as Policy } from "./Policy";
// export { default as Posts } from "./dashboard/Posts";
// export { default as Profile } from "./profile/Profile";
// export { default as ProfileLayout } from "../layouts/ProfileLayout";
// // Publications: keep public default but add clearer aliases to avoid confusion with profile publications
// export { default as Publications } from "./Publications";
// export { default as PublicationsPublic } from "./Publications";
// export { default as PublicationsProfile } from "./profile/Publications";
// // Profile-specific pages
// export { default as EventsProfile } from "./profile/Events";
// export { default as CreateEvent } from "./profile/CreateEvent";
// export { default as EditEvent } from "./profile/EditEvent";
// export { default as CreatePublication } from "./profile/CreatePublication";
// export { default as EditPublication } from "./profile/EditPublication";
// export { default as Register } from "./Register";
// export { default as Settings } from "./dashboard/SettingsNew";
// export { default as Stats } from "./Stats";
// export { default as SubcategoryItem } from "../components/SubcategoryItem";
// export { default as SubcategoryItem1 } from "../components/SubcategoryItem1";
// export { default as TopicDetail } from "./forum/TopicDetail";
// export { default as Users } from "./Users";
// export { default as VerifyAccount } from "./VerifyAccount";

// const AppRoutes = () => (
//   <Routes>
//     {/* Exemple de route */}
//     <Route path="/" element={<Home />} errorElement={<ErrorPage />} />
//     <Route path="*" element={<ErrorPage />} />
//   </Routes>
// );

// export default AppRoutes;

// ── Layouts ──────────────────────────────────────────────
export { default as HomeLayout } from "../layouts/HomeLayout";
export { default as DashboardLayout } from "../layouts/DashboardLayout";
export { default as ProfileLayout } from "../layouts/ProfileLayout";

// ── Error ─────────────────────────────────────────────────
export { default as ErrorPage } from "./ErrorPage";

// ── Public ────────────────────────────────────────────────
export { default as Home } from "./Home";
export { default as Landing } from "./Landing";
export { default as About } from "./About";
export { default as Login } from "./Login";
export { default as Register } from "./Register";
export { default as VerifyAccount } from "./VerifyAccount";
export { default as Policy } from "./Policy";

// Pages publiques avec loader API réel
export { default as News } from "./public/News";
export { default as Events } from "./public/Events";
export { default as Publications } from "./public/Publications";
export { default as PublicationsPublic } from "./public/Publications"; // alias
export { default as Ads } from "./public/Ads";
export { default as AdDetailPage } from "./public/AdDetailPage";
export { default as Contacts } from "./public/Contacts";

// Forum
export { default as Forum } from "./Forum";
export { default as TopicDetail } from "./forum/TopicDetail";

// ── Profile ───────────────────────────────────────────────
export { default as Profile } from "./profile/Profile";
export { default as CreateAdPage } from "./profile/CreateAdPage";

// Events profil
export { default as EventsProfile } from "./profile/Events";
export { default as CreateEvent } from "./profile/CreateEvent";
export { default as EditEvent } from "./profile/EditEvent";

// Publications profil
export { default as PublicationsProfile } from "./profile/Publications";
export { default as CreatePublication } from "./profile/CreatePublication";
export { default as EditPublication } from "./profile/EditPublication";

// ── Dashboard ─────────────────────────────────────────────
export { default as Dashboard } from "./dashboard/Dashboard";
export { default as Admin } from "./dashboard/Admin";
export { default as EditAdPage } from "./dashboard/EditAdPage";
export { default as EditUser } from "./dashboard/EditUser";
export { default as Settings } from "./dashboard/SettingsNew";
export { default as Posts } from "./dashboard/Posts";

// Dashboard EditEvent (page dédiée)
export { default as DashboardEditEvent } from "./dashboard/EditEvent";

// Managers
export { default as AdsManager } from "./AdsManager";
export { default as EventsManager } from "./EventsManager";
export { default as NewsManager } from "./NewsManager";
export { default as ForumManager } from "./ForumManager";
export { default as CategoryManager } from "./CategoryManager";
export { default as CategoryDetails } from "./CategoryDetails";
export { default as Users } from "./Users";
export { default as Stats } from "./Stats";
