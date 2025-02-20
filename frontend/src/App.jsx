import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
  PrivacyPolicy,
} from './pages'

import { CategoryForm, Loading } from './components'

import { action as registerAction } from './pages/Register'
import { action as loginAction } from './pages/Login'
import { action as createAdAction } from './pages/CreateAdPage'
// import { action as categoryAction } from "./pages/CategoryManager";
// import { action as categoryAction } from "./pages/CategoryMenager1";
import {
  // createCategoryAction,
  // updateCategoryAction,
  // deleteCategoryAction,
  categoryAction,
} from './pages/CategoryMenager1'

import { loader as accountLoader } from './pages/VerifyAccount'
// import { loader as categoryLoader } from "./pages/CategoryManager";
import { loader as categoryLoader } from './pages/CategoryMenager1'
import { loader as adsLoader } from './pages/Ads'
import { loader as adLoader } from './pages/AdDetailPage'
import { loader as catLoader } from './pages/CreateAdPage'
import { loader as profileLoader } from './pages/ProfileLayout'
import { loader as categoryDetailsLoader } from './pages/CategoryDetails'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
          HydrateFallback: Loading,
        },
        {
          path: 'forum',
          element: <Forum />,
          HydrateFallback: Loading,
        },
        {
          path: 'news',
          element: <News />,
          HydrateFallback: Loading,
        },
        {
          path: 'ads',
          element: <Ads />,
          loader: adsLoader,
          HydrateFallback: Loading,
        },
        {
          path: 'ads/:id',
          element: <AdDetailPage />,
          HydrateFallback: Loading,

          loader: adLoader,
        },
        {
          path: 'login',
          element: <Login />,
          action: loginAction,
          HydrateFallback: Loading,
        },
        {
          path: 'register',
          element: <Register />,
          action: registerAction,
          HydrateFallback: Loading,
        },
        {
          path: 'verify-account/:token',
          element: <VerifyAccount />,
          loader: accountLoader,
        },
        {
          path: 'events',
          element: <Events />,
          HydrateFallback: Loading,
        },
        {
          path: 'contact',
          element: <Contacts />,
          HydrateFallback: Loading,
        },
        {
          path: 'publications',
          element: <Publications />,
          HydrateFallback: Loading,
        },
        {
          path: 'privacy-policy',
          element: <PrivacyPolicy />,
          HydrateFallback: Loading,
        },
        {
          path: 'profile',
          element: <ProfileLayout />,
          HydrateFallback: Loading,

          loader: profileLoader,

          children: [
            {
              index: true,
              element: <Profile />,
              HydrateFallback: Loading,
            },
            {
              path: 'create-ad',
              element: <CreateAdPage />,
              HydrateFallback: Loading,

              loader: catLoader,
              action: createAdAction,
            },
          ],
        },
      ],
    },
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
          HydrateFallback: Loading,
        },
        {
          path: 'admin',
          element: <Admin />,
          HydrateFallback: Loading,
        },
        {
          path: 'create-ad',
          element: <CreateAdPage />,
          HydrateFallback: Loading,

          loader: catLoader,
        },
        {
          path: 'categories',
          element: <CategoryManager1 />,
          HydrateFallback: Loading,

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
)

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
  )
}
export default App
