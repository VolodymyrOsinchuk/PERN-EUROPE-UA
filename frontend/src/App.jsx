import { createBrowserRouter, RouterProvider } from "react-router-dom";

// ── Context & global components ───────────────────────────
import { AuthProvider } from "./context/AuthContext";
import { CookieConsentProvider } from "./context/CookieConsentContext";
import CookieConsentUI from "./components/CookieConsent/CookieConsentUI";
import { Loading, SubcategoryItem, SubcategoryItem1 } from "./components";

// ── Layouts ───────────────────────────────────────────────
import HomeLayout from "./layouts/HomeLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfileLayout from "./layouts/ProfileLayout";

// ── Error ─────────────────────────────────────────────────
import ErrorPage from "./pages/ErrorPage";

// ── Public pages ──────────────────────────────────────────
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Policy from "./pages/Policy";
import CountriesIndex from "./pages/CountriesIndex";
import Country, { loader as countryLoader } from "./pages/Country";
import Messages, { loader as messagesLoader } from "./pages/Messages";

// Auth
import Login, { action as loginAction } from "./pages/Login";
import Register, { action as registerAction } from "./pages/Register";
import VerifyAccount, { loader as accountLoader } from "./pages/VerifyAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// News
import News, { loader as newsLoader } from "./pages/News";
import NewsDetail, { loader as newsDetailLoader } from "./pages/NewsDetail";

// Events
import Events, { loader as eventsLoader } from "./pages/Events";
import EventDetail, { loader as eventDetailLoader } from "./pages/EventDetail";

// Publications
import Publications, {
  loader as publicationsLoader,
} from "./pages/Publications";
import PublicationDetail, {
  loader as publicationDetailLoader,
} from "./pages/PublicationDetail";

// Ads
import Ads, { loader as adsLoader } from "./pages/public/Ads";
import AdDetailPage, {
  loader as adLoader,
  action as adAction,
} from "./pages/public/AdDetailPage";

// Contact
import Contacts, { action as contactAction } from "./pages/public/Contacts";

// Forum
import Forum, {
  loader as forumLoader,
  action as forumAction,
} from "./pages/Forum";
import TopicDetail, {
  loader as topicLoader,
  action as topicAction,
} from "./pages/forum/TopicDetail";

// ── Profile pages ─────────────────────────────────────────
import Profile, {
  profileLoader,
  action as updateProfileAction,
} from "./pages/profile/Profile";
import MyAds from "./pages/profile/MyAds";
import CreateAdPage, {
  loader as catLoader,
  action as createAdAction,
} from "./pages/profile/CreateAdPage";
import EditAdPage, {
  loader as editAdLoader,
  action as editAdAction,
} from "./pages/dashboard/EditAdPage";
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
import PublicationsProfile, {
  loader as profilePublicationsLoader,
  action as profilePublicationsAction,
} from "./pages/profile/Publications";
import CreatePublication from "./pages/profile/CreatePublication"; // action as createPublicationAction,
import EditPublication, {
  loader as editPublicationLoader,
  // action as editPublicationAction,
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
import PublicationForm from "./pages/dashboard/PublicationForm"; // loader as publicationFormLoader,
import AdsManager, {
  loader as adsManagerLoader,
  action as adsManagerAction,
} from "./pages/AdsManager";
import EventsManager, {
  loader as eventsManagerLoader,
  action as eventsManagerAction,
} from "./pages/EventsManager";
import DashboardEditEvent, {
  loader as dashboardEditEventLoader,
  action as dashboardEditEventAction,
} from "./pages/dashboard/EditEvent";
import CategoryManager, {
  loader as categoryLoader,
  categoryAction,
} from "./pages/CategoryManager";
import CategoryDetails, {
  loader as categoryDetailsLoader,
} from "./pages/CategoryDetails";
import Posts, {
  loader as postsLoader,
  action as postsAction,
} from "./pages/dashboard/Posts";
import NewsManager, {
  loader as newsManagerLoader,
  action as newsManagerAction,
} from "./pages/NewsManager";
import ModerationManager from "./pages/dashboard/ModerationManager";
import PublicationModeration from "./pages/dashboard/PublicationModeration";
import MessageReportsManager, {
  loader as messageReportsLoader,
} from "./pages/dashboard/MessageReportsManager";
import Stats, { loader as statsLoader } from "./pages/Stats";
import Settings, {
  loader as settingsLoader,
  action as settingsAction,
} from "./pages/dashboard/SettingsNew";
import AdExpirationSettings from "./pages/dashboard/AdExpirationSettings";
import Admin, {
  loader as adminLoader,
  action as adminAction,
} from "./pages/dashboard/Admin";
import ForumManager, {
  loader as forumManagerLoader,
} from "./pages/dashboard/ForumManager";

// ── Shared router options ─────────────────────────────────
const futureFlags = {
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_relativeSplatPath: true,
  v7_skipActionErrorRevalidation: true,
  v7_startTransition: true,
};

// ── Route groups ──────────────────────────────────────────
const publicRoutes = [
  { index: true, element: <Home /> },
  { path: "landing", element: <Landing /> },
  { path: "about", element: <About /> },
  { path: "policy", element: <Policy /> },

  // Auth
  { path: "login", element: <Login />, action: loginAction },
  { path: "register", element: <Register />, action: registerAction },
  {
    path: "verify-account/:token",
    element: <VerifyAccount />,
    loader: accountLoader,
  },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "reset-password/:token", element: <ResetPassword /> },

  // Contact
  { path: "contact", element: <Contacts />, action: contactAction },

  // News
  { path: "news", element: <News />, loader: newsLoader },
  { path: "news/:id", element: <NewsDetail />, loader: newsDetailLoader },

  // Events
  { path: "events", element: <Events />, loader: eventsLoader },
  { path: "events/:id", element: <EventDetail />, loader: eventDetailLoader },

  // Publications
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

  // Countries
  { path: "countries", element: <CountriesIndex /> },
  { path: "countries/:code", element: <Country />, loader: countryLoader },

  // Ads
  { path: "ads", element: <Ads />, loader: adsLoader },
  {
    path: "ads/:id",
    element: <AdDetailPage />,
    loader: adLoader,
    action: adAction,
  },

  // Messages
  {
    path: "messages/:conversationId?",
    element: <Messages />,
    loader: messagesLoader,
  },

  // Forum
  {
    path: "forum",
    element: <Forum />,
    loader: forumLoader,
    action: forumAction,
  },
  {
    path: "forum/:id",
    element: <TopicDetail />,
    loader: topicLoader,
    action: topicAction,
  },
];

const profileRoutes = [
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
  { path: "my-ads", element: <MyAds /> },
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
    // action: createPublicationAction,
  },
  {
    path: "publications/edit/:id",
    element: <EditPublication />,
    loader: editPublicationLoader,
    // action: editPublicationAction,
  },
];

const dashboardRoutes = [
  { index: true, element: <Dashboard />, loader: dashboardLoader },

  // Users
  {
    path: "users",
    element: <Users />,
    loader: usersLoader,
    action: usersAction,
  },
  { path: "users/:id/edit", element: <EditUser /> },

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

  // Moderation
  { path: "moderation", element: <ModerationManager /> },
  { path: "publications/moderation", element: <PublicationModeration /> },
  {
    path: "message-reports",
    element: <MessageReportsManager />,
    loader: messageReportsLoader,
  },

  // Events
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

  // Publications & News
  {
    path: "posts",
    element: <Posts />,
    loader: postsLoader,
    action: postsAction,
  },
  { path: "publications/new", element: <PublicationForm mode="create" /> },
  {
    path: "publications/:id/edit",
    element: <PublicationForm mode="edit" />,
    // loader: publicationFormLoader,
  },
  {
    path: "news",
    element: <NewsManager />,
    loader: newsManagerLoader,
    action: newsManagerAction,
  },

  // Forum
  {
    path: "forum",
    element: <ForumManager />,
    loader: forumManagerLoader,
  },

  // Stats, settings, admin
  { path: "stats", element: <Stats />, loader: statsLoader },
  {
    path: "settings",
    element: <Settings />,
    loader: settingsLoader,
    action: settingsAction,
  },
  { path: "settings/ad-expiration", element: <AdExpirationSettings /> },
  {
    path: "admin",
    element: <Admin />,
    loader: adminLoader,
    action: adminAction,
  },
];

// ── Router ────────────────────────────────────────────────
const router = createBrowserRouter(
  [
    {
      element: <AuthProvider />,
      errorElement: <ErrorPage />,
      HydrateFallback: Loading,
      children: [
        {
          path: "/",
          element: <HomeLayout />,
          HydrateFallback: Loading,
          errorElement: <ErrorPage />,
          children: publicRoutes,
        },
        {
          path: "/profile",
          element: <ProfileLayout />,
          HydrateFallback: Loading,
          errorElement: <ErrorPage />,
          children: profileRoutes,
        },
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          errorElement: <ErrorPage />,
          children: dashboardRoutes,
        },
      ],
    },
  ],
  { future: futureFlags },
);

const App = () => (
  <CookieConsentProvider>
    <RouterProvider router={router} future={futureFlags} />
    <CookieConsentUI />
  </CookieConsentProvider>
);

export default App;
