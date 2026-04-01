import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  AdDetailPage,
  Admin,
  Ads,
  AdsManager,
  AppLayout,
  CategoryDetails,
  CategoryManager,
  Contacts,
  CreateAdPage,
  Dashboard,
  DashboardLayout,
  ErrorPage,
  Events,
  EventsManager,
  Forum,
  Home,
  HomeLayout,
  Login,
  News,
  Policy,
  Posts,
  Profile,
  ProfileLayout,
  Publications,
  Register,
  Settings,
  Users,
  VerifyAccount,
} from "./pages/index";

import { CategoryForm, Loading, SubcategoryItem } from "./components";
import { SubcategoryItem1 } from "./components";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as createAdAction } from "./pages/profile/CreateAdPage";
import { action as updateProfileAction } from "./pages/profile/Profile";
import { categoryAction } from "./pages/CategoryManager";

import { loader as accountLoader } from "./pages/VerifyAccount";
import { loader as categoryLoader } from "./pages/CategoryManager";
import { loader as adsLoader } from "./pages/public/Ads";
import { loader as adLoader } from "./pages/public/AdDetailPage";
import { loader as catLoader } from "./pages/profile/CreateAdPage";
import { loader as profileLoader } from "./layouts/ProfileLayout";
import { loader as categoryDetailsLoader } from "./pages/CategoryDetails";
import { loader as dashboardLoader } from "./pages/dashboard/Dashboard";
import { loader as usersLoader, action as usersAction } from "./pages/Users";
import { loader as adsManagerLoader } from "./pages/AdsManager";
import { loader as eventsManagerLoader } from "./pages/EventsManager";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      HydrateFallback: Loading,
      // loader: profileLoader,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
          HydrateFallback: Loading,
        },
        {
          path: "forum",
          element: <Forum />,
          HydrateFallback: Loading,
        },
        {
          path: "news",
          element: <News />,
          HydrateFallback: Loading,
        },
        {
          path: "ads",
          element: <Ads />,
          loader: adsLoader,
          HydrateFallback: Loading,
        },
        {
          path: "ads/:id",
          element: <AdDetailPage />,
          HydrateFallback: Loading,

          loader: adLoader,
        },
        {
          path: "login",
          element: <Login />,
          action: loginAction,
          HydrateFallback: Loading,
        },
        {
          path: "register",
          element: <Register />,
          action: registerAction,
          HydrateFallback: Loading,
        },
        {
          path: "verify-account/:token",
          element: <VerifyAccount />,
          loader: accountLoader,
        },
        {
          path: "events",
          element: <Events />,
          HydrateFallback: Loading,
        },
        {
          path: "contact",
          element: <Contacts />,
          HydrateFallback: Loading,
        },
        {
          path: "publications",
          element: <Publications />,
          HydrateFallback: Loading,
        },
        {
          path: "policy",
          element: <Policy />,
          HydrateFallback: Loading,
        },
      ],
    },
    {
      path: "/profile",
      element: <ProfileLayout />,
      HydrateFallback: Loading,
      loader: profileLoader,
      children: [
        {
          index: true,
          element: <Profile />,
          HydrateFallback: Loading,
          action: updateProfileAction,
        },
        {
          path: "create-ad",
          element: <CreateAdPage />,
          HydrateFallback: Loading,
          loader: catLoader,
          action: createAdAction,
        },
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
          loader: dashboardLoader,
          HydrateFallback: Loading,
        },
        {
          path: "users",
          element: <Users />,
          loader: usersLoader,
          action: usersAction,
          HydrateFallback: Loading,
        },
        {
          path: "ads",
          element: <AdsManager />,
          loader: adsManagerLoader,
          HydrateFallback: Loading,
        },
        {
          path: "events",
          element: <EventsManager />,
          loader: eventsManagerLoader,
          HydrateFallback: Loading,
        },
        {
          path: "create-ad",
          element: <CreateAdPage />,
          HydrateFallback: Loading,

          loader: catLoader,
        },
        {
          path: "categories",
          element: <CategoryManager />,
          HydrateFallback: Loading,

          loader: categoryLoader,
          action: categoryAction,
        },
        {
          path: "categories/:id",
          element: <CategoryDetails />,
          HydrateFallback: Loading,
        },
        {
          path: "categories/:categoryId/sub-categories",
          element: <SubcategoryItem />,
          HydrateFallback: Loading,
        },
        {
          path: "categories/:categoryId/sub-categories/:id",
          element: <SubcategoryItem1 />,
          HydrateFallback: Loading,
        },
        {
          path: "posts",
          element: <Posts />,
          HydrateFallback: Loading,
        },
        {
          path: "settings",
          element: <Settings />,
          HydrateFallback: Loading,
        },
        {
          path: "admin",
          element: <Admin />,
          HydrateFallback: Loading,
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransition: true,
    },
  },
);

const App = () => {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
        v7_startTransition: true,
      }}
    />
  );
};
export default App;
