import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Admin,
  Ads,
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
  Publications,
  Register,
  VerifyAccount,
} from "./pages";
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
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "verify-account",
          element: <VerifyAccount />,
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
