import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Ads,
  Contacts,
  Dashboard,
  ErrorPage,
  Events,
  Forum,
  Home,
  HomeLayout,
  News,
  Publications,
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
