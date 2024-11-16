import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
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
      ],
    },
  ]
  // {
  //   future: {
  //     v7_relativeSplatPath: true,
  //     v7_startTransition: true,
  //   },
  // }
);

const App = () => {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
      // future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    />
  );
};
export default App;
