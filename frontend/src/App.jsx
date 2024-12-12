import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Admin,
  Ads,
  AdDetailPage,
  CategoryDetails,
  CategoryManager1,
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

import { CategoryForm } from "./components";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
// import { action as categoryAction } from "./pages/CategoryManager";
// import { action as categoryAction } from "./pages/CategoryMenager1";
import {
  // createCategoryAction,
  // updateCategoryAction,
  // deleteCategoryAction,
  categoryAction,
} from "./pages/CategoryMenager1";

import { loader as accountLoader } from "./pages/VerifyAccount";
// import { loader as categoryLoader } from "./pages/CategoryManager";
import { loader as categoryLoader } from "./pages/CategoryMenager1";
import { loader as adsLoader } from "./pages/Ads";
import { loader as adLoader } from "./pages/AdDetailPage";
import { loader as categoryDetailsLoader } from "./pages/CategoryDetails";

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
          loader: adsLoader,
        },
        {
          path: "ads/:id",
          element: <AdDetailPage />,
          loader: adLoader,
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
          element: <CategoryManager1 />,
          loader: categoryLoader,
          action: categoryAction,
        },
        // {
        //   path: "categories/create",
        //   element: <CategoryForm />,
        //   action: createCategoryAction,
        // },
        // {
        //   path: ":categoryId/edit",
        //   element: <CategoryForm />,
        //   action: updateCategoryAction,
        //   // loader: singleCategoryLoader,
        // },
        // {
        //   path: ":categoryId/delete",
        //   action: deleteCategoryAction,
        // },
        // {
        //   path: "action",
        //   action: categoryAction,
        // },
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
