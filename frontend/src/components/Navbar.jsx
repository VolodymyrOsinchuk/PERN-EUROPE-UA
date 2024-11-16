import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "../assets/css/navbar.css";

const Navbar = () => {
  const [languageAnchor, setLanguageAnchor] = React.useState(null);
  const [currentLanguage, setCurrentLanguage] = React.useState("en");
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
        publications: "Публікації",
        forum: "Форум",
        contacts: "Контакти",
      },
    },
    en: {
      title: "Ukrainians in Europe",
      menu: {
        home: "Home",
        news: "News",
        events: "Events",
        publications: "Publications",
        forum: "Forum",
        contacts: "Contacts",
      },
    },
  };

  const t = translations[currentLanguage];

  const menuItems = [
    { text: t.menu.home, href: "/" },
    { text: t.menu.news, href: "/news" },
    { text: t.menu.events, href: "/events" },
    { text: t.menu.publications, href: "/publications" },
    { text: t.menu.forum, href: "/forum" },
    { text: t.menu.contacts, href: "/contact" },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <div className="site-logo" onClick={() => (window.location.href = "/")}>
          <span className="material-icons logo-icon">public</span>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {t.title}
          </Typography>
        </div>

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
                    button
                    key={index}
                    component="a"
                    href={item.href}
                    onClick={toggleMobileMenu}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
                <ListItem button onClick={handleLanguageClick}>
                  <ListItemText primary="Language" />
                  <span className="material-icons">language</span>
                </ListItem>
              </List>
            </Drawer>
          </>
        ) : (
          <>
            {menuItems.map((item, index) => (
              <Button key={index} color="inherit" href={item.href}>
                {item.text}
              </Button>
            ))}
            <Button
              color="inherit"
              onClick={handleLanguageClick}
              endIcon={<span className="material-icons">language</span>}
            >
              Language
            </Button>
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
          <MenuItem onClick={() => handleLanguageClose("en")}>English</MenuItem>
          <MenuItem onClick={() => handleLanguageClose("pl")}>Polski</MenuItem>
          <MenuItem onClick={() => handleLanguageClose("de")}>Deutsch</MenuItem>
          <MenuItem onClick={() => handleLanguageClose("fr")}>
            Français
          </MenuItem>
          <MenuItem onClick={() => handleLanguageClose("it")}>
            Italiano
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
