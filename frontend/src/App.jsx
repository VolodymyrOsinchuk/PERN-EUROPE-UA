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
import EventDetail, { loader as eventDetailLoader } from "./pages/EventDetail";
// Publications public — loader API réel
import Publications, {
  loader as publicationsLoader,
} from "./pages/Publications";
import PublicationDetail, {
  loader as publicationDetailLoader,
} from "./pages/PublicationDetail";

import Ads, { loader as adsLoader } from "./pages/public/Ads";
import AdDetailPage, {
  loader as adLoader,
  action as adAction,
} from "./pages/public/AdDetailPage";
import Contacts, { action as contactAction } from "./pages/public/Contacts";

// Messages — messagerie entre utilisateurs
import Messages, { loader as messagesLoader } from "./pages/Messages";

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
import Settings, {
  loader as settingsLoader,
  action as settingsAction,
} from "./pages/dashboard/SettingsNew";
import Admin, {
  loader as adminLoader,
  action as adminAction,
} from "./pages/dashboard/Admin";

// Forum menager — loader + action câblés
import ForumManager, {
  loader as forumManagerLoader,
  // action as forumManagerAction,
} from "./pages/dashboard/ForumManager";

import AdExpirationSettings from "./pages/dashboard/AdExpirationSettings";

// ─────────────────────────────────────────────────────────
const router = createBrowserRouter(
  [
    {
      element: <AuthProvider />,
      errorElement: <ErrorPage />,
      HydrateFallback: Loading,
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
            {
              path: "events/:id",
              element: <EventDetail />,
              loader: eventDetailLoader,
            },
            // Publications public — loader API
            {
              path: "publications",
              element: <Publications />,
              loader: publicationsLoader,
            },
            {
              path: "publications/:id",
              element: <PublicationDetail />,
              loader: publicationDetailLoader,
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

            // Messages — messagerie intégrée
            {
              path: "messages",
              element: <Messages />,
              loader: messagesLoader,
            },

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
              loader: settingsLoader,
              action: settingsAction,
            },
            {
              path: "settings/ad-expiration",
              element: <AdExpirationSettings />,
            },
            // Admin
            {
              path: "admin",
              element: <Admin />,
              loader: adminLoader,
              action: adminAction,
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
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransition: true,
    }}
  />
);

export default App;
