import React from 'react'
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
} from '@mui/material'
import { Link, useOutletContext, useNavigate } from 'react-router-dom'
import { useProfileContext } from '../layouts/ProfileLayout'
import '../assets/css/navbar.css'

const Navbar = ({ user }) => {
  const [languageAnchor, setLanguageAnchor] = React.useState(null)
  const [currentLanguage, setCurrentLanguage] = React.useState('uk')
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { logoutUser } = useProfileContext() || {}

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget)
  }

  const handleLanguageClose = (lang) => {
    setLanguageAnchor(null)
    if (lang) {
      setCurrentLanguage(lang)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const translations = {
    uk: {
      title: 'Українці в Європі',
      menu: {
        home: 'Головна',
        news: 'Новини',
        events: 'Афіша',
        ads: 'Оголошення',
        publications: 'Публікації',
        forum: 'Форум',
        contacts: 'Контакт',
        language: 'Мова',
        dashboard: 'Панель',
        profile: 'Профіль',
        logout: 'Вийти',
      },
    },
    en: {
      title: 'Ukrainians in Europe',
      menu: {
        home: 'Home',
        news: 'News',
        events: 'Events',
        ads: 'Ads',
        publications: 'Publications',
        forum: 'Forum',
        contacts: 'Contacts',
        language: 'Language',
        dashboard: 'Dashboard',
        profile: 'Profile',
        logout: 'Logout',
      },
    },
    pl: {
      title: 'Ukraińcy w Europie',
      menu: {
        home: 'Strona główna',
        news: 'Aktualności',
        events: 'Wydarzenia',
        ads: 'Ogłoszenia',
        publications: 'Publikacje',
        forum: 'Forum',
        contacts: 'Kontakt',
        language: 'Język',
        dashboard: 'Panel',
        profile: 'Profil',
        logout: 'Wyloguj',
      },
    },
    de: {
      title: 'Ukrainer in Europa',
      menu: {
        home: 'Startseite',
        news: 'Nachrichten',
        events: 'Veranstaltungen',
        ads: 'Anzeigen',
        publications: 'Publikationen',
        forum: 'Forum',
        contacts: 'Kontakt',
        language: 'Sprache',
        dashboard: 'Dashboard',
        profile: 'Profil',
        logout: 'Abmelden',
      },
    },
    fr: {
      title: 'Ukrainiens en Europe',
      menu: {
        home: 'Accueil',
        news: 'Actualités',
        events: 'Événements',
        ads: 'Annonces',
        publications: 'Publications',
        forum: 'Forum',
        contacts: 'Contact',
        language: 'Langue',
        dashboard: 'Tableau de bord',
        profile: 'Profil',
        logout: 'Déconnexion',
      },
    },
    it: {
      title: 'Ucraini in Europa',
      menu: {
        home: 'Home',
        news: 'Notizie',
        events: 'Eventi',
        ads: 'Annunci',
        publications: 'Pubblicazioni',
        forum: 'Forum',
        contacts: 'Contatti',
        language: 'Lingua',
        dashboard: 'Dashboard',
        profile: 'Profilo',
        logout: 'Uscire',
      },
    },
  }

  const t = translations[currentLanguage]

  const menuItems = [
    { text: t.menu.home, href: '/' },
    { text: t.menu.news, href: '/news' },
    { text: t.menu.events, href: '/events' },
    { text: t.menu.ads, href: '/ads' },
    { text: t.menu.publications, href: '/publications' },
    { text: t.menu.forum, href: '/forum' },
    { text: t.menu.contacts, href: '/contact' },
  ]

  // Ajouter les éléments de menu conditionnels
  // if (t.menu.dashboard) {
  //   menuItems.push({ text: t.menu.dashboard, href: '/dashboard' })
  // }
  // if (t.menu.profile) {
  //   menuItems.push({ text: t.menu.profile, href: '/profile' })
  // }
  // if (t.menu.login) {
  //   menuItems.push({ text: t.menu.login, href: '/login' })
  // }
  // if (t.menu.register) {
  //   menuItems.push({ text: t.menu.register, href: '/register' })
  // }

  // Ajout des éléments de menu pour les utilisateurs authentifiés
  const userMenuItems = user
    ? [
        { text: t.menu.dashboard, href: '/dashboard' },
        { text: t.menu.profile, href: '/profile' },
        { text: t.menu.logout, onClick: logoutUser },
      ]
    : []

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <div className="site-logo" onClick={() => navigate('/')}>
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
                  {userMenuItems.map((item, index) => (
                    <ListItem
                      key={`user-${index}`}
                      component={item.href ? Link : 'div'}
                      to={item.href}
                      onClick={() => {
                        if (item.onClick) item.onClick()
                        toggleMobileMenu()
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
                >
                  {item.text}
                </Button>
              ))}
              {userMenuItems.map((item, index) => (
                <Button
                  key={`user-${index}`}
                  color="inherit"
                  component={item.href ? Link : 'button'}
                  to={item.href}
                  onClick={item.onClick}
                >
                  {item.text}
                </Button>
              ))}
              <Button
                color="inherit"
                onClick={handleLanguageClick}
                startIcon={<span className="material-icons">language</span>}
              >
                {/* {t.menu.language} */}
              </Button>
              {/* {t.menu.logout && (
                <Button color="inherit" onClick={logoutUser}>
                  {t.menu.logout}
                </Button>
              )} */}
            </>
          )}

          <Menu
            anchorEl={languageAnchor}
            open={Boolean(languageAnchor)}
            onClose={() => handleLanguageClose()}
          >
            <MenuItem onClick={() => handleLanguageClose('uk')}>
              Українська
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose('en')}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose('pl')}>
              Polski
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose('de')}>
              Deutsch
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose('fr')}>
              Français
            </MenuItem>
            <MenuItem onClick={() => handleLanguageClose('it')}>
              Italiano
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  )
}
export default Navbar
