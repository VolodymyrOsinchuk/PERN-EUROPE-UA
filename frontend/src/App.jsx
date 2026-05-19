import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import {
  About,
  AdDetailPage,
  Admin,
  Ads,
  AdsManager,
  CategoryDetails,
  CategoryManager,
  Contacts,
  CreateAdPage,
  Dashboard,
  DashboardLayout,
  EditAdPage,
  EditUser,
  ErrorPage,
  Events,
  EventsManager,
  Forum,
  Home,
  HomeLayout,
  Landing,
  Login,
  News,
  NewsManager,
  Policy,
  Posts,
  Profile,
  ProfileLayout,
  PublicationsPublic,
  Register,
  Settings,
  Stats,
  Users,
  VerifyAccount,
} from "./pages/index";

import { CategoryForm, Loading, SubcategoryItem } from "./components";
import { SubcategoryItem1 } from "./components";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as createAdAction } from "./pages/profile/CreateAdPage";
import {
  action as updateProfileAction,
  // FIX: profileLoader charge les ads de l'utilisateur — était manquant sur la route index
  profileLoader,
} from "./pages/profile/Profile";
import { categoryAction } from "./pages/CategoryManager";
import { action as contactAction } from "./pages/public/Contacts";

import { loader as accountLoader } from "./pages/VerifyAccount";
import TopicDetail, {
  loader as topicLoader,
  action as topicAction,
} from "./pages/forum/TopicDetail";
import { loader as forumLoader, action as forumAction } from "./pages/Forum";
import { loader as categoryLoader } from "./pages/CategoryManager";
import EventsProfile, {
  loader as profileEventsLoader,
  action as profileEventsAction,
} from "./pages/profile/Events";
import CreateEvent, {
  action as createEventAction,
} from "./pages/profile/CreateEvent";
import EditEvent, {
  loader as editEventLoader,
  action as editEventAction,
} from "./pages/profile/EditEvent";
import PublicationsProfile, {
  loader as publicationsLoader,
  action as publicationsAction,
} from "./pages/profile/Publications";
import CreatePublication, {
  action as createPublicationAction,
} from "./pages/profile/CreatePublication";
import EditPublication, {
  loader as editPublicationLoader,
  action as editPublicationAction,
} from "./pages/profile/EditPublication";
import { loader as adsLoader } from "./pages/public/Ads";
import {
  loader as adLoader,
  action as adAction,
} from "./pages/public/AdDetailPage";
import { loader as catLoader } from "./pages/profile/CreateAdPage";
import { loader as categoryDetailsLoader } from "./pages/CategoryDetails";
import { loader as dashboardLoader } from "./pages/dashboard/Dashboard";
import { loader as statsLoader } from "./pages/Stats";
import { loader as usersLoader, action as usersAction } from "./pages/Users";
import {
  loader as adsManagerLoader,
  action as adsManagerAction,
} from "./pages/AdsManager";
import {
  loader as eventsManagerLoader,
  action as eventsManagerAction,
} from "./pages/EventsManager";
import {
  loader as editAdLoader,
  action as editAdAction,
} from "./pages/dashboard/EditAdPage";
import {
  loader as newsManagerLoader,
  action as newsManagerAction,
} from "./pages/NewsManager";

const router = createBrowserRouter(
  [
    // ─── ROOT AUTH PROVIDER ─────────────────────────────────────
    {
      element: <AuthProvider />,
      errorElement: <ErrorPage />,
      children: [
        // ─── PUBLIC LAYOUT ──────────────────────────────────────────
        {
          path: "/",
          element: <HomeLayout />,
          HydrateFallback: Loading,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <Home />,
              HydrateFallback: Loading,
            },
            {
              path: "landing",
              element: <Landing />,
              HydrateFallback: Loading,
            },
            {
              path: "about",
              element: <About />,
              HydrateFallback: Loading,
            },
            {
              path: "forum",
              element: <Forum />,
              loader: forumLoader,
              action: forumAction,
              HydrateFallback: Loading,
            },
            {
              path: "forum/:id",
              element: <TopicDetail />,
              loader: topicLoader,
              action: topicAction,
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
              action: adAction,
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
              action: contactAction,
              HydrateFallback: Loading,
            },
            {
              path: "publications",
              element: <PublicationsPublic />,
              HydrateFallback: Loading,
            },
            {
              path: "policy",
              element: <Policy />,
              HydrateFallback: Loading,
            },
          ],
        },
        // ─── PROFILE LAYOUT (utilisateur authentifié) ────────────────
        // Navbar avec user connecté — loader d'auth obligatoire
        {
          path: "/profile",
          element: <ProfileLayout />,
          HydrateFallback: Loading,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <Profile />,
              HydrateFallback: Loading,
              // FIX: profileLoader charge les ads de l'utilisateur connecté
              // Sans ce loader, useLoaderData() retourne null → ads vide
              loader: profileLoader,
              action: updateProfileAction,
            },
            {
              path: "create-ad",
              element: <CreateAdPage />,
              HydrateFallback: Loading,
              loader: catLoader,
              action: createAdAction,
            },
            {
              path: "edit-ad/:id",
              element: <EditAdPage />,
              HydrateFallback: Loading,
              loader: editAdLoader,
              action: editAdAction,
            },
            {
              path: "events",
              element: <EventsProfile />,
              loader: profileEventsLoader,
              action: profileEventsAction,
              HydrateFallback: Loading,
            },
            {
              path: "events/create",
              element: <CreateEvent />,
              action: createEventAction,
              HydrateFallback: Loading,
            },
            {
              path: "events/edit/:id",
              element: <EditEvent />,
              loader: editEventLoader,
              action: editEventAction,
              HydrateFallback: Loading,
            },
            {
              path: "publications",
              element: <PublicationsProfile />,
              loader: publicationsLoader,
              action: publicationsAction,
              HydrateFallback: Loading,
            },
            {
              path: "publications/create",
              element: <CreatePublication />,
              action: createPublicationAction,
              HydrateFallback: Loading,
            },
            {
              path: "publications/edit/:id",
              element: <EditPublication />,
              loader: editPublicationLoader,
              action: editPublicationAction,
              HydrateFallback: Loading,
            },
          ],
        },

        // ─── DASHBOARD LAYOUT (administrateur) ───────────────────────
        // Sidebar + AppBar — ThemeProvider dédié
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          errorElement: <ErrorPage />,
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
              // FIX: AdsManager action redirigait vers /dashboard/posts
              // Corrigé → /dashboard/ads
              path: "ads",
              element: <AdsManager />,
              loader: adsManagerLoader,
              action: adsManagerAction,
              HydrateFallback: Loading,
            },
            {
              path: "events",
              element: <EventsManager />,
              loader: eventsManagerLoader,
              action: eventsManagerAction,
              HydrateFallback: Loading,
            },
            {
              path: "create-ad",
              element: <CreateAdPage />,
              HydrateFallback: Loading,
              loader: catLoader,
              action: createAdAction,
            },
            {
              // FIX: EditAdPage action redirigait vers /dashboard/posts
              // Corrigé → /dashboard/ads
              path: "edit-ad/:id",
              element: <EditAdPage />,
              HydrateFallback: Loading,
              loader: editAdLoader,
              action: editAdAction,
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
              loader: categoryDetailsLoader,
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
              // Dashboard "Публікації" — renommé de Posts pour éviter confusion avec /dashboard/ads
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
            {
              path: "stats",
              element: <Stats />,
              loader: statsLoader,
              HydrateFallback: Loading,
            },
            {
              path: "news",
              element: <NewsManager />,
              loader: newsManagerLoader,
              action: newsManagerAction,
              HydrateFallback: Loading,
            },
            {
              path: "users/:id/edit",
              element: <EditUser />,
              HydrateFallback: Loading,
            },
          ],
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
