import React from "react";
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
} from "@mui/material";
import { Link } from "react-router-dom";
import "../assets/css/navbar.css";

const Navbar = () => {
  const [languageAnchor, setLanguageAnchor] = React.useState(null);
  const [currentLanguage, setCurrentLanguage] = React.useState("uk");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    setLanguageAnchor(null);
    if (lang) {
      setCurrentLanguage(lang);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
        contacts: "Контакти",
        language: "Мова",
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
        language: "Language",
      },
    },
  };

  const t = translations[currentLanguage];

  const menuItems = [
    { text: t.menu.home, href: "/" },
    { text: t.menu.news, href: "/news" },
    { text: t.menu.events, href: "/events" },
    { text: t.menu.ads, href: "/ads" },
    { text: t.menu.publications, href: "/publications" },
    { text: t.menu.forum, href: "/forum" },
    { text: t.menu.contacts, href: "/contact" },
    { text: t.menu.language },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div
            className="site-logo"
            onClick={() => (window.location.href = "/")}
          >
            <span className="material-icons logo-icon">public</span>
          </div>
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
                  <ListItem onClick={handleLanguageClick}>
                    <ListItemText primary="Language" />
                    <span className="material-icons">language</span>
                  </ListItem>
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
                >
                  {item.text}
                </Button>
              ))}
              <Button
                color="inherit"
                onClick={handleLanguageClick}
                endIcon={<span className="material-icons">language</span>}
              ></Button>
            </>
          )}

          <Menu
            anchorEl={languageAnchor}
            open={Boolean(languageAnchor)}
            onClose={() => handleLanguageClose()}
          >
            <MenuItem onClick={() => handleLanguageClose("uk")}>
              Українська
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose("en")}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose("pl")}>
              Polski
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose("de")}>
              Deutsch
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose("fr")}>
              Français
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose("it")}>
              Italiano
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Navbar;
