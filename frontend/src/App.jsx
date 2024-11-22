import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Admin,
  Ads,
  CategoryManager,
  Contacts,
  CreateAdPage,
  Dashboard,
  DashboardLayout,
  ErrorPage,
  Events,
  Forum,
  Home,
  HomeLayout,
  Login,
  News,
  Profile,
  ProfileLayout,
  Publications,
  Register,
  VerifyAccount,
} from "./pages";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";

import { loader as accountLoader } from "./pages/VerifyAccount";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "forum",
          element: <Forum />,
        },
        {
          path: "news",
          element: <News />,
        },
        {
          path: "ads",
          element: <Ads />,
        },
        {
          path: "login",
          element: <Login />,
          action: loginAction,
        },
        {
          path: "register",
          element: <Register />,
          action: registerAction,
        },
        {
          path: "verify-account/:token",
          element: <VerifyAccount />,
          loader: accountLoader,
        },
        {
          path: "events",
          element: <Events />,
        },
        {
          path: "contact",
          element: <Contacts />,
        },
        {
          path: "publications",
          element: <Publications />,
        },
        {
          path: "profile",
          element: <ProfileLayout />,
          children: [
            {
              index: true,
              element: <Profile />,
            },
            {
              path: "create-ad",
              element: <CreateAdPage />,
            },
          ],
        },
      ],
    },
    {
      path: "dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "admin",
          element: <Admin />,
        },
        {
          path: "create-ad",
          element: <CreateAdPage />,
        },
        {
          path: "categories",
          element: <CategoryManager />,
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
  }
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
