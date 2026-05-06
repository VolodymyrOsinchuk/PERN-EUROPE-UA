// import { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   IconButton,
//   Menu,
//   MenuItem,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { useProfileContext } from "../layouts/ProfileLayout";
// import "../assets/css/navbar.css";

// const Navbar = ({ user }) => {
//   const [languageAnchor, setLanguageAnchor] = useState(null);
//   const [currentLanguage, setCurrentLanguage] = useState("uk");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const navigate = useNavigate();
//   const { logoutUser } = useProfileContext() || {};

//   const handleLanguageClick = (event) => {
//     setLanguageAnchor(event.currentTarget);
//   };

//   const handleLanguageClose = (lang) => {
//     setLanguageAnchor(null);
//     if (lang) {
//       setCurrentLanguage(lang);
//     }
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   const translations = {
//     uk: {
//       title: "Українці в Європі",
//       menu: {
//         home: "Головна",
//         news: "Новини",
//         events: "Афіша",
//         ads: "Оголошення",
//         publications: "Публікації",
//         forum: "Форум",
//         contacts: "Контакт",
//         language: "Мова",
//         dashboard: "Панель",
//         profile: "Профіль",
//         logout: "Вийти",
//       },
//     },
//     en: {
//       title: "Ukrainians in Europe",
//       menu: {
//         home: "Home",
//         news: "News",
//         events: "Events",
//         ads: "Ads",
//         publications: "Publications",
//         forum: "Forum",
//         contacts: "Contacts",
//         language: "Language",
//         dashboard: "Dashboard",
//         profile: "Profile",
//         logout: "Logout",
//       },
//     },
//     pl: {
//       title: "Ukraińcy w Europie",
//       menu: {
//         home: "Strona główna",
//         news: "Aktualności",
//         events: "Wydarzenia",
//         ads: "Ogłoszenia",
//         publications: "Publikacje",
//         forum: "Forum",
//         contacts: "Kontakt",
//         language: "Język",
//         dashboard: "Panel",
//         profile: "Profil",
//         logout: "Wyloguj",
//       },
//     },
//     de: {
//       title: "Ukrainer in Europa",
//       menu: {
//         home: "Startseite",
//         news: "Nachrichten",
//         events: "Veranstaltungen",
//         ads: "Anzeigen",
//         publications: "Publikationen",
//         forum: "Forum",
//         contacts: "Kontakt",
//         language: "Sprache",
//         dashboard: "Dashboard",
//         profile: "Profil",
//         logout: "Abmelden",
//       },
//     },
//     fr: {
//       title: "Ukrainiens en Europe",
//       menu: {
//         home: "Accueil",
//         news: "Actualités",
//         events: "Événements",
//         ads: "Annonces",
//         publications: "Publications",
//         forum: "Forum",
//         contacts: "Contact",
//         language: "Langue",
//         dashboard: "Tableau de bord",
//         profile: "Profil",
//         logout: "Déconnexion",
//       },
//     },
//     it: {
//       title: "Ucraini in Europa",
//       menu: {
//         home: "Home",
//         news: "Notizie",
//         events: "Eventi",
//         ads: "Annunci",
//         publications: "Pubblicazioni",
//         forum: "Forum",
//         contacts: "Contatti",
//         language: "Lingua",
//         dashboard: "Dashboard",
//         profile: "Profilo",
//         logout: "Uscire",
//       },
//     },
//   };

//   const t = translations[currentLanguage];

//   const menuItems = [
//     { text: t.menu.home, href: "/" },
//     { text: t.menu.news, href: "/news" },
//     { text: t.menu.events, href: "/events" },
//     { text: t.menu.ads, href: "/ads" },
//     { text: t.menu.publications, href: "/publications" },
//     { text: t.menu.forum, href: "/forum" },
//     { text: t.menu.contacts, href: "/contact" },
//   ];

//   // Menu items for authenticated users
//   const userMenuItems = user
//     ? [
//         { text: t.menu.dashboard, href: "/dashboard" },
//         { text: t.menu.profile, href: "/profile" },
//         { text: t.menu.logout, onClick: logoutUser },
//       ]
//     : [];

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <div className="site-logo" onClick={() => navigate("/")}>
//             <span className="material-icons logo-icon">public</span>
//           </div>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             {t.title}
//           </Typography>

//           {isMobile ? (
//             <>
//               <IconButton
//                 edge="start"
//                 color="inherit"
//                 aria-label="menu"
//                 onClick={toggleMobileMenu}
//               >
//                 <span className="material-icons">menu</span>
//               </IconButton>
//               <Drawer
//                 anchor="right"
//                 open={mobileMenuOpen}
//                 onClose={toggleMobileMenu}
//               >
//                 <List style={{ width: 250 }}>
//                   {menuItems.map((item, index) => (
//                     <ListItem
//                       key={index}
//                       component={Link}
//                       to={item.href}
//                       onClick={toggleMobileMenu}
//                     >
//                       <ListItemText primary={item.text} />
//                     </ListItem>
//                   ))}
//                   {userMenuItems.map((item, index) => (
//                     <ListItem
//                       key={`user-${index}`}
//                       component={item.href ? Link : "div"}
//                       to={item.href}
//                       onClick={() => {
//                         if (item.onClick) item.onClick();
//                         toggleMobileMenu();
//                       }}
//                     >
//                       <ListItemText primary={item.text} />
//                     </ListItem>
//                   ))}
//                 </List>
//               </Drawer>
//             </>
//           ) : (
//             <>
//               {menuItems.map((item, index) => (
//                 <Button
//                   key={index}
//                   color="inherit"
//                   component={Link}
//                   to={item.href}
//                 >
//                   {item.text}
//                 </Button>
//               ))}
//               {userMenuItems.map((item, index) => (
//                 <Button
//                   key={`user-${index}`}
//                   color="inherit"
//                   component={item.href ? Link : "button"}
//                   to={item.href}
//                   onClick={item.onClick}
//                 >
//                   {item.text}
//                 </Button>
//               ))}
//               <Button
//                 color="inherit"
//                 onClick={handleLanguageClick}
//                 startIcon={<span className="material-icons">language</span>}
//               />
//             </>
//           )}

//           <Menu
//             anchorEl={languageAnchor}
//             open={Boolean(languageAnchor)}
//             onClose={() => handleLanguageClose()}
//           >
//             <MenuItem onClick={() => handleLanguageClose("uk")}>
//               Українська
//             </MenuItem>
//             <MenuItem onClick={() => handleLanguageClose("en")}>
//               English
//             </MenuItem>
//             <MenuItem onClick={() => handleLanguageClose("pl")}>
//               Polski
//             </MenuItem>
//             <MenuItem onClick={() => handleLanguageClose("de")}>
//               Deutsch
//             </MenuItem>
//             <MenuItem onClick={() => handleLanguageClose("fr")}>
//               Français
//             </MenuItem>
//             <MenuItem onClick={() => handleLanguageClose("it")}>
//               Italiano
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
//     </>
//   );
// };
// export default Navbar;

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import "../assets/css/navbar.css";

const Navbar = ({ user: userProp }) => {
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("uk");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const { user, logoutUser } = useAuthContext();
  const activeUser = user ?? userProp ?? null;

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    setLanguageAnchor(null);
    if (lang) setCurrentLanguage(lang);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);

  const translations = {
    uk: {
      title: "Українці в Європі",
      menu: {
        home: "Головна",
        news: "Новини",
        events: "Афіша",
        ads: "Оголошення",
        publications: "Публікації",
        forum: "Форум",
        contacts: "Контакт",
        about: "Про нас",
        language: "Мова",
        dashboard: "Панель",
        profile: "Профіль",
        logout: "Вийти",
        login: "Увійти",
        register: "Реєстрація",
      },
    },
    en: {
      title: "Ukrainians in Europe",
      menu: {
        home: "Home",
        news: "News",
        events: "Events",
        ads: "Ads",
        publications: "Publications",
        forum: "Forum",
        contacts: "Contacts",
        about: "About",
        language: "Language",
        dashboard: "Dashboard",
        profile: "Profile",
        logout: "Logout",
        login: "Sign In",
        register: "Register",
      },
    },
    pl: {
      title: "Ukraińcy w Europie",
      menu: {
        home: "Strona główna",
        news: "Aktualności",
        events: "Wydarzenia",
        ads: "Ogłoszenia",
        publications: "Publikacje",
        forum: "Forum",
        contacts: "Kontakt",
        about: "O nas",
        language: "Język",
        dashboard: "Panel",
        profile: "Profil",
        logout: "Wyloguj",
        login: "Zaloguj",
        register: "Rejestracja",
      },
    },
    fr: {
      title: "Ukrainiens en Europe",
      menu: {
        home: "Accueil",
        news: "Actualités",
        events: "Événements",
        ads: "Annonces",
        publications: "Publications",
        forum: "Forum",
        contacts: "Contact",
        about: "À propos",
        language: "Langue",
        dashboard: "Tableau de bord",
        profile: "Profil",
        logout: "Déconnexion",
        login: "Connexion",
        register: "S'inscrire",
      },
    },
    de: {
      title: "Ukrainer in Europa",
      menu: {
        home: "Startseite",
        news: "Nachrichten",
        events: "Veranstaltungen",
        ads: "Anzeigen",
        publications: "Publikationen",
        forum: "Forum",
        contacts: "Kontakt",
        about: "Über uns",
        language: "Sprache",
        dashboard: "Dashboard",
        profile: "Profil",
        logout: "Abmelden",
        login: "Anmelden",
        register: "Registrieren",
      },
    },
    it: {
      title: "Ucraini in Europa",
      menu: {
        home: "Home",
        news: "Notizie",
        events: "Eventi",
        ads: "Annunci",
        publications: "Pubblicazioni",
        forum: "Forum",
        contacts: "Contatti",
        about: "Chi siamo",
        language: "Lingua",
        dashboard: "Dashboard",
        profile: "Profilo",
        logout: "Uscire",
        login: "Accedi",
        register: "Registrati",
      },
    },
  };

  const t = translations[currentLanguage] || translations.uk;

  const menuItems = [
    { text: t.menu.home, href: "/" },
    { text: t.menu.news, href: "/news" },
    { text: t.menu.events, href: "/events" },
    { text: t.menu.ads, href: "/ads" },
    { text: t.menu.publications, href: "/publications" },
    { text: t.menu.forum, href: "/forum" },
    { text: t.menu.contacts, href: "/contact" },
    { text: t.menu.about, href: "/about" },
  ];

  // Menu selon état d'authentification
  const authMenuItems = activeUser
    ? [
        { text: t.menu.profile, href: "/profile" },
        ...(activeUser.role === "admin"
          ? [{ text: t.menu.dashboard, href: "/dashboard" }]
          : []),
        { text: t.menu.logout, onClick: logoutUser },
      ]
    : [
        { text: t.menu.login, href: "/login" },
        { text: t.menu.register, href: "/register" },
      ];

  const getUserInitials = () => {
    if (!activeUser) return null;
    return (activeUser.firstName?.[0] || activeUser.email?.[0] || "U").toUpperCase();
  };

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box
            className="site-logo"
            onClick={() => navigate("/")}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <span className="material-icons logo-icon">public</span>
          </Box>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t.title}
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
              >
                <span className="material-icons">menu</span>
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
              >
                <List style={{ width: 250 }}>
                  {menuItems.map((item, index) => (
                    <ListItem
                      key={index}
                      component={Link}
                      to={item.href}
                      onClick={toggleMobileMenu}
                    >
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                  {authMenuItems.map((item, index) => (
                    <ListItem
                      key={`auth-${index}`}
                      component={item.href ? Link : "div"}
                      to={item.href}
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        toggleMobileMenu();
                      }}
                    >
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  color="inherit"
                  component={Link}
                  to={item.href}
                  size="small"
                >
                  {item.text}
                </Button>
              ))}

              {/* Language selector */}
              <IconButton
                color="inherit"
                onClick={handleLanguageClick}
                size="small"
                sx={{ ml: 0.5 }}
              >
                <span className="material-icons" style={{ fontSize: 20 }}>
                  language
                </span>
              </IconButton>

              {/* Auth section */}
              {activeUser ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/profile"
                    size="small"
                    sx={{ ml: 0.5 }}
                  >
                    {t.menu.profile}
                  </Button>
                  {activeUser.role === "admin" && (
                    <Button
                      color="inherit"
                      component={Link}
                      to="/dashboard"
                      size="small"
                    >
                      {t.menu.dashboard}
                    </Button>
                  )}
                  <Avatar
                    onClick={logoutUser}
                    sx={{
                      width: 32,
                      height: 32,
                      ml: 1,
                      bgcolor: "rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                    }}
                    title={t.menu.logout}
                  >
                    {getUserInitials()}
                  </Avatar>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    size="small"
                    sx={{ ml: 0.5 }}
                  >
                    {t.menu.login}
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    component={Link}
                    to="/register"
                    size="small"
                    sx={{ ml: 0.5, borderColor: "rgba(255,255,255,0.5)" }}
                  >
                    {t.menu.register}
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={() => handleLanguageClose()}
      >
        <MenuItem onClick={() => handleLanguageClose("uk")}>
          🇺🇦 Українська
        </MenuItem>
        <MenuItem onClick={() => handleLanguageClose("en")}>
          🇬🇧 English
        </MenuItem>
        <MenuItem onClick={() => handleLanguageClose("pl")}>🇵🇱 Polski</MenuItem>
        <MenuItem onClick={() => handleLanguageClose("de")}>
          🇩🇪 Deutsch
        </MenuItem>
        <MenuItem onClick={() => handleLanguageClose("fr")}>
          🇫🇷 Français
        </MenuItem>
        <MenuItem onClick={() => handleLanguageClose("it")}>
          🇮🇹 Italiano
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
