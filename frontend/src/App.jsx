// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import {
//   EditUser,
//   // EditJob,
//   About,
//   AdDetailPage,
//   Admin,
//   Ads,
//   AdsManager,
//   CategoryDetails,
//   CategoryManager,
//   Contacts,
//   CreateAdPage,
//   Dashboard,
//   DashboardLayout,
//   EditAdPage,
//   ErrorPage,
//   Events,
//   EventsManager,
//   Forum,
//   Home,
//   HomeLayout,
//   Landing,
//   Login,
//   News,
//   NewsManager,
//   Policy,
//   Posts,
//   Profile,
//   ProfileLayout,
//   PublicationsPublic,
//   Register,
//   Settings,
//   Stats,
//   Users,
//   VerifyAccount,
// } from "./pages/index";
// import { loader as publicationsPublicLoader } from "./pages/Publications";

// import { loader as eventsPublicLoader } from "./pages/Events";

// import { CategoryForm, Loading, SubcategoryItem } from "./components";
// import { SubcategoryItem1 } from "./components";

// import { action as registerAction } from "./pages/Register";
// import { action as loginAction } from "./pages/Login";
// import { action as createAdAction } from "./pages/profile/CreateAdPage";
// import {
//   action as updateProfileAction,
//   // FIX: profileLoader charge les ads de l'utilisateur — était manquant sur la route index
//   profileLoader,
// } from "./pages/profile/Profile";
// import { categoryAction } from "./pages/CategoryManager";
// import { action as contactAction } from "./pages/public/Contacts";

// import { loader as accountLoader } from "./pages/VerifyAccount";
// import TopicDetail, {
//   loader as topicLoader,
//   action as topicAction,
// } from "./pages/forum/TopicDetail";
// import { loader as forumLoader, action as forumAction } from "./pages/Forum";
// import { loader as categoryLoader } from "./pages/CategoryManager";
// import EventsProfile, {
//   loader as profileEventsLoader,
//   action as profileEventsAction,
// } from "./pages/profile/Events";
// import CreateEvent, {
//   action as createEventAction,
// } from "./pages/profile/CreateEvent";
// import EditEvent, {
//   loader as editEventLoader,
//   action as editEventAction,
// } from "./pages/profile/EditEvent";
// import PublicationsProfile, {
//   loader as publicationsLoader,
//   action as publicationsAction,
// } from "./pages/profile/Publications";
// import CreatePublication, {
//   action as createPublicationAction,
// } from "./pages/profile/CreatePublication";
// import EditPublication, {
//   loader as editPublicationLoader,
//   action as editPublicationAction,
// } from "./pages/profile/EditPublication";
// import { loader as adsLoader } from "./pages/public/Ads";
// import {
//   loader as adLoader,
//   action as adAction,
// } from "./pages/public/AdDetailPage";
// import { loader as catLoader } from "./pages/profile/CreateAdPage";
// import { loader as categoryDetailsLoader } from "./pages/CategoryDetails";
// import { loader as dashboardLoader } from "./pages/dashboard/Dashboard";
// import { loader as statsLoader } from "./pages/Stats";
// import { loader as usersLoader, action as usersAction } from "./pages/Users";
// import {
//   loader as adsManagerLoader,
//   action as adsManagerAction,
// } from "./pages/AdsManager";
// import {
//   loader as eventsManagerLoader,
//   action as eventsManagerAction,
// } from "./pages/EventsManager";
// import {
//   loader as editAdLoader,
//   action as editAdAction,
// } from "./pages/dashboard/EditAdPage";
// import {
//   loader as newsManagerLoader,
//   action as newsManagerAction,
// } from "./pages/NewsManager";

// const router = createBrowserRouter(
//   [
//     // ─── ROOT AUTH PROVIDER ─────────────────────────────────────
//     {
//       element: <AuthProvider />,
//       errorElement: <ErrorPage />,
//       children: [
//         // ─── PUBLIC LAYOUT ──────────────────────────────────────────
//         {
//           path: "/",
//           element: <HomeLayout />,
//           HydrateFallback: Loading,
//           errorElement: <ErrorPage />,
//           children: [
//             {
//               index: true,
//               element: <Home />,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "landing",
//               element: <Landing />,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "about",
//               element: <About />,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "forum",
//               element: <Forum />,
//               loader: forumLoader,
//               action: forumAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "forum/:id",
//               element: <TopicDetail />,
//               loader: topicLoader,
//               action: topicAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "news",
//               element: <News />,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "ads",
//               element: <Ads />,
//               loader: adsLoader,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "ads/:id",
//               element: <AdDetailPage />,
//               HydrateFallback: Loading,
//               loader: adLoader,
//               action: adAction,
//             },
//             {
//               path: "login",
//               element: <Login />,
//               action: loginAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "register",
//               element: <Register />,
//               action: registerAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "verify-account/:token",
//               element: <VerifyAccount />,
//               loader: accountLoader,
//             },
//             {
//               path: "events",
//               element: <Events />,
//               HydrateFallback: Loading,
//               loader: eventsPublicLoader,
//             },
//             {
//               path: "contact",
//               element: <Contacts />,
//               action: contactAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "publications",
//               element: <PublicationsPublic />,
//               loader: publicationsPublicLoader,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "policy",
//               element: <Policy />,
//               HydrateFallback: Loading,
//             },
//           ],
//         },
//         // ─── PROFILE LAYOUT (utilisateur authentifié) ────────────────
//         // Navbar avec user connecté — loader d'auth obligatoire
//         {
//           path: "/profile",
//           element: <ProfileLayout />,
//           HydrateFallback: Loading,
//           errorElement: <ErrorPage />,
//           children: [
//             {
//               index: true,
//               element: <Profile />,
//               HydrateFallback: Loading,
//               // FIX: profileLoader charge les ads de l'utilisateur connecté
//               // Sans ce loader, useLoaderData() retourne null → ads vide
//               loader: profileLoader,
//               action: updateProfileAction,
//             },
//             {
//               path: "create-ad",
//               element: <CreateAdPage />,
//               HydrateFallback: Loading,
//               loader: catLoader,
//               action: createAdAction,
//             },
//             {
//               path: "edit-ad/:id",
//               element: <EditAdPage />,
//               HydrateFallback: Loading,
//               loader: editAdLoader,
//               action: editAdAction,
//             },
//             {
//               path: "events",
//               element: <EventsProfile />,
//               loader: profileEventsLoader,
//               action: profileEventsAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "events/create",
//               element: <CreateEvent />,
//               action: createEventAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "events/edit/:id",
//               element: <EditEvent />,
//               loader: editEventLoader,
//               action: editEventAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "publications",
//               element: <PublicationsProfile />,
//               loader: publicationsLoader,
//               action: publicationsAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "publications/create",
//               element: <CreatePublication />,
//               action: createPublicationAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "publications/edit/:id",
//               element: <EditPublication />,
//               loader: editPublicationLoader,
//               action: editPublicationAction,
//               HydrateFallback: Loading,
//             },
//           ],
//         },

//         // ─── DASHBOARD LAYOUT (administrateur) ───────────────────────
//         // Sidebar + AppBar — ThemeProvider dédié
//         {
//           path: "/dashboard",
//           element: <DashboardLayout />,
//           errorElement: <ErrorPage />,
//           children: [
//             {
//               index: true,
//               element: <Dashboard />,
//               loader: dashboardLoader,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "users",
//               element: <Users />,
//               loader: usersLoader,
//               action: usersAction,
//               HydrateFallback: Loading,
//             },
//             {
//               // FIX: AdsManager action redirigait vers /dashboard/posts
//               // Corrigé → /dashboard/ads
//               path: "ads",
//               element: <AdsManager />,
//               loader: adsManagerLoader,
//               action: adsManagerAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "events",
//               element: <EventsManager />,
//               loader: eventsManagerLoader,
//               action: eventsManagerAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "create-ad",
//               element: <CreateAdPage />,
//               HydrateFallback: Loading,
//               loader: catLoader,
//               action: createAdAction,
//             },
//             {
//               // FIX: EditAdPage action redirigait vers /dashboard/posts
//               // Corrigé → /dashboard/ads
//               path: "edit-ad/:id",
//               element: <EditAdPage />,
//               HydrateFallback: Loading,
//               loader: editAdLoader,
//               action: editAdAction,
//             },
//             {
//               path: "categories",
//               element: <CategoryManager />,
//               HydrateFallback: Loading,
//               loader: categoryLoader,
//               action: categoryAction,
//             },
//             {
//               path: "categories/:id",
//               element: <CategoryDetails />,
//               loader: categoryDetailsLoader,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "categories/:categoryId/sub-categories",
//               element: <SubcategoryItem />,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "categories/:categoryId/sub-categories/:id",
//               element: <SubcategoryItem1 />,
//               HydrateFallback: Loading,
//             },
//             {
//               // Dashboard "Публікації" — renommé de Posts pour éviter confusion avec /dashboard/ads
//               path: "posts",
//               element: <Posts />,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "settings",
//               element: <Settings />,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "admin",
//               element: <Admin />,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "stats",
//               element: <Stats />,
//               loader: statsLoader,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "news",
//               element: <NewsManager />,
//               loader: newsManagerLoader,
//               action: newsManagerAction,
//               HydrateFallback: Loading,
//             },
//             {
//               path: "users/:id/edit",
//               element: <EditUser />,
//               HydrateFallback: Loading,
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   {
//     future: {
//       v7_fetcherPersist: true,
//       v7_normalizeFormMethod: true,
//       v7_partialHydration: true,
//       v7_relativeSplatPath: true,
//       v7_skipActionErrorRevalidation: true,
//       v7_startTransition: true,
//     },
//   },
// );

// const App = () => {
//   return (
//     <RouterProvider
//       router={router}
//       future={{
//         v7_fetcherPersist: true,
//         v7_normalizeFormMethod: true,
//         v7_partialHydration: true,
//         v7_relativeSplatPath: true,
//         v7_skipActionErrorRevalidation: true,
//         v7_startTransition: true,
//       }}
//     />
//   );
// };

// export default App;
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Loading } from "./components";

// ── Layouts ──────────────────────────────────────────────
import HomeLayout from "./layouts/HomeLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfileLayout from "./layouts/ProfileLayout";

// ── Error ─────────────────────────────────────────────────
import ErrorPage from "./pages/ErrorPage";

// ── Public pages ──────────────────────────────────────────
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Login, { action as loginAction } from "./pages/Login";
import Register, { action as registerAction } from "./pages/Register";
import VerifyAccount, { loader as accountLoader } from "./pages/VerifyAccount";
import Policy from "./pages/Policy";

// News — loader API réel
import News, { loader as newsLoader } from "./pages/News";
import NewsDetail, { loader as newsDetailLoader } from "./pages/NewsDetail";
// Events public — loader API réel
import Events, { loader as eventsLoader } from "./pages/Events";
// Publications public — loader API réel
import Publications, {
  loader as publicationsLoader,
} from "./pages/Publications";

import Ads, { loader as adsLoader } from "./pages/public/Ads";
import AdDetailPage, {
  loader as adLoader,
  action as adAction,
} from "./pages/public/AdDetailPage";
import Contacts, { action as contactAction } from "./pages/public/Contacts";

// Forum — Dialog de création câblé + guard auth
import Forum, {
  loader as forumLoader,
  action as forumAction,
} from "./pages/Forum";
// TopicDetail — guard auth sur le form de réponse
import TopicDetail, {
  loader as topicLoader,
  action as topicAction,
} from "./pages/forum/TopicDetail";

// ── Profile pages ─────────────────────────────────────────
import Profile, {
  profileLoader,
  action as updateProfileAction,
} from "./pages/profile/Profile";
import CreateAdPage, {
  loader as catLoader,
  action as createAdAction,
} from "./pages/profile/CreateAdPage";
import EditAdPage, {
  loader as editAdLoader,
  action as editAdAction,
} from "./pages/dashboard/EditAdPage";

// Events profil
import EventsProfile, {
  loader as profileEventsLoader,
  action as profileEventsAction,
} from "./pages/profile/Events";
import CreateEvent, {
  action as createEventAction,
} from "./pages/profile/CreateEvent";
import EditEventProfile, {
  loader as editEventProfileLoader,
  action as editEventProfileAction,
} from "./pages/profile/EditEvent";

// Publications profil
import PublicationsProfile, {
  loader as profilePublicationsLoader,
  action as profilePublicationsAction,
} from "./pages/profile/Publications";
import CreatePublication, {
  action as createPublicationAction,
} from "./pages/profile/CreatePublication";
import EditPublication, {
  loader as editPublicationLoader,
  action as editPublicationAction,
} from "./pages/profile/EditPublication";

// ── Dashboard pages ───────────────────────────────────────
import Dashboard, {
  loader as dashboardLoader,
} from "./pages/dashboard/Dashboard";
import Users, {
  loader as usersLoader,
  action as usersAction,
} from "./pages/Users";
import EditUser from "./pages/dashboard/EditUser";

// AdsManager
import AdsManager, {
  loader as adsManagerLoader,
  action as adsManagerAction,
} from "./pages/AdsManager";

// EventsManager — Edit câblé vers /dashboard/events/edit/:id
import EventsManager, {
  loader as eventsManagerLoader,
  action as eventsManagerAction,
} from "./pages/EventsManager";
// Page d'édition d'un event depuis le dashboard
import DashboardEditEvent, {
  loader as dashboardEditEventLoader,
  action as dashboardEditEventAction,
} from "./pages/dashboard/EditEvent";

// CategoryManager
import CategoryManager, {
  loader as categoryLoader,
  categoryAction,
} from "./pages/CategoryManager";
import CategoryDetails, {
  loader as categoryDetailsLoader,
} from "./pages/CategoryDetails";
import { SubcategoryItem, SubcategoryItem1 } from "./components";

// Posts (Publications dashboard) — Edit câblé via Dialog
import Posts, {
  loader as postsLoader,
  action as postsAction,
} from "./pages/dashboard/Posts";

// NewsManager — Create + Edit câblés
import NewsManager, {
  loader as newsManagerLoader,
  action as newsManagerAction,
} from "./pages/NewsManager";

// Stats, Settings, Admin
import Stats, { loader as statsLoader } from "./pages/Stats";
import Settings from "./pages/dashboard/SettingsNew";
import Admin from "./pages/dashboard/Admin";

// Forum menager — loader + action câblés
import ForumManager, {
  loader as forumManagerLoader,
  // action as forumManagerAction,
} from "./pages/dashboard/ForumManager";

// ─────────────────────────────────────────────────────────
const router = createBrowserRouter(
  [
    {
      element: <AuthProvider />,
      errorElement: <ErrorPage />,
      children: [
        // ══ PUBLIC LAYOUT ═════════════════════════════════
        {
          path: "/",
          element: <HomeLayout />,
          HydrateFallback: Loading,
          errorElement: <ErrorPage />,
          children: [
            { index: true, element: <Home /> },
            { path: "landing", element: <Landing /> },
            { path: "about", element: <About /> },
            { path: "policy", element: <Policy /> },

            // News — loader API
            {
              path: "news",
              element: <News />,
              loader: newsLoader,
            },
            {
              path: "news/:id",
              element: <NewsDetail />,
              loader: newsDetailLoader,
            },
            // Events public — loader API
            {
              path: "events",
              element: <Events />,
              loader: eventsLoader,
            },
            // Publications public — loader API
            {
              path: "publications",
              element: <Publications />,
              loader: publicationsLoader,
            },

            // Ads
            { path: "ads", element: <Ads />, loader: adsLoader },
            {
              path: "ads/:id",
              element: <AdDetailPage />,
              loader: adLoader,
              action: adAction,
            },

            // Auth
            { path: "login", element: <Login />, action: loginAction },
            { path: "register", element: <Register />, action: registerAction },
            {
              path: "verify-account/:token",
              element: <VerifyAccount />,
              loader: accountLoader,
            },

            // Contact
            { path: "contact", element: <Contacts />, action: contactAction },

            // Forum — Dialog de création + action
            {
              path: "forum",
              element: <Forum />,
              loader: forumLoader,
              action: forumAction,
            },
            // TopicDetail — guard auth sur réponse
            {
              path: "forum/:id",
              element: <TopicDetail />,
              loader: topicLoader,
              action: topicAction,
            },
          ],
        },

        // ══ PROFILE LAYOUT ════════════════════════════════
        {
          path: "/profile",
          element: <ProfileLayout />,
          HydrateFallback: Loading,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <Profile />,
              loader: profileLoader,
              action: updateProfileAction,
            },
            // Ads
            {
              path: "create-ad",
              element: <CreateAdPage />,
              loader: catLoader,
              action: createAdAction,
            },
            {
              path: "edit-ad/:id",
              element: <EditAdPage />,
              loader: editAdLoader,
              action: editAdAction,
            },
            // Events
            {
              path: "events",
              element: <EventsProfile />,
              loader: profileEventsLoader,
              action: profileEventsAction,
            },
            {
              path: "events/create",
              element: <CreateEvent />,
              action: createEventAction,
            },
            {
              path: "events/edit/:id",
              element: <EditEventProfile />,
              loader: editEventProfileLoader,
              action: editEventProfileAction,
            },
            // Publications
            {
              path: "publications",
              element: <PublicationsProfile />,
              loader: profilePublicationsLoader,
              action: profilePublicationsAction,
            },
            {
              path: "publications/create",
              element: <CreatePublication />,
              action: createPublicationAction,
            },
            {
              path: "publications/edit/:id",
              element: <EditPublication />,
              loader: editPublicationLoader,
              action: editPublicationAction,
            },
          ],
        },

        // ══ DASHBOARD LAYOUT ══════════════════════════════
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <Dashboard />,
              loader: dashboardLoader,
            },
            // Users
            {
              path: "users",
              element: <Users />,
              loader: usersLoader,
              action: usersAction,
            },
            {
              path: "users/:id/edit",
              element: <EditUser />,
            },
            // Ads
            {
              path: "ads",
              element: <AdsManager />,
              loader: adsManagerLoader,
              action: adsManagerAction,
            },
            {
              path: "create-ad",
              element: <CreateAdPage />,
              loader: catLoader,
              action: createAdAction,
            },
            {
              path: "edit-ad/:id",
              element: <EditAdPage />,
              loader: editAdLoader,
              action: editAdAction,
            },
            // Events dashboard — Edit câblé
            {
              path: "events",
              element: <EventsManager />,
              loader: eventsManagerLoader,
              action: eventsManagerAction,
            },
            {
              path: "events/edit/:id",
              element: <DashboardEditEvent />,
              loader: dashboardEditEventLoader,
              action: dashboardEditEventAction,
            },
            // Categories
            {
              path: "categories",
              element: <CategoryManager />,
              loader: categoryLoader,
              action: categoryAction,
            },
            {
              path: "categories/:id",
              element: <CategoryDetails />,
              loader: categoryDetailsLoader,
            },
            {
              path: "categories/:categoryId/sub-categories",
              element: <SubcategoryItem />,
            },
            {
              path: "categories/:categoryId/sub-categories/:id",
              element: <SubcategoryItem1 />,
            },
            // Forum manager
            {
              path: "forum",
              element: <ForumManager />,
              loader: forumManagerLoader,
              // action: forumManagerAction,
            },
            // Publications dashboard — Edit câblé via Dialog
            {
              path: "posts",
              element: <Posts />,
              loader: postsLoader,
              action: postsAction,
            },
            // News dashboard — Create + Edit câblés
            {
              path: "news",
              element: <NewsManager />,
              loader: newsManagerLoader,
              action: newsManagerAction,
            },
            // Stats
            {
              path: "stats",
              element: <Stats />,
              loader: statsLoader,
            },
            // Settings
            {
              path: "settings",
              element: <Settings />,
            },
            // Admin
            {
              path: "admin",
              element: <Admin />,
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

const App = () => (
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

export default App;
