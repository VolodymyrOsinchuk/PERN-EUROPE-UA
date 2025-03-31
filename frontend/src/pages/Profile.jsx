import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Typography,
  Container,
  Paper,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import Info from '../components/Info'
import ProfileHeader from '../components/ProfileHeader'
import AdCard from '../components/AdCard'
import TabNavigation from '../components/TabNavigation'
import DeleteDialog from '../components/DeleteDialog'
import '../assets/css/profile.css'
import { Link } from 'react-router-dom'
import { useProfileContext } from '../layouts/ProfileLayout'

const advertisements = [
  {
    id: 1,
    title: 'Шукаю роботу програмістом',
    date: '10.06.2023',
    description:
      '5 років досвіду роботи з React, Node.js. Шукаю віддалену роботу або офіс у Берліні.',
    views: 245,
    responses: 12,
  },
  {
    id: 2,
    title: 'Здам кімнату в Берліні',
    date: '05.06.2023',
    description:
      'Затишна кімната в районі Мітте, 18м², повністю мебльована. 650€ на місяць включно з комунальними.',
    views: 532,
    responses: 8,
  },
  {
    id: 3,
    title: 'Пропоную послуги перекладача',
    date: '01.06.2023',
    description:
      'Усний та письмовий переклад українська-німецька-англійська. Досвід роботи 3 роки.',
    views: 167,
    responses: 5,
  },
]
const Profile = () => {
  const { user } = useProfileContext()
  // console.log('🚀 ~ Profile ~  user:', user)

  const [value, setValue] = useState(0)
  const [languageAnchor, setLanguageAnchor] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Олена Петренко',
    location: 'Берлін, Німеччина',
    email: 'olena.p@example.com',
    phone: '+49 123 456 789',
    about:
      'Переїхала до Німеччини у 2022 році. Працюю IT-спеціалістом, люблю подорожувати та знайомитися з новими людьми.',
  })

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
  }

  const handleProfileUpdate = () => {
    // Here would be API call to update profile
    handleEditDialogClose()
  }

  const handleInputChange = (e) => {
    setProfileData({
      ...user,
      [e.target.name]: e.target.value,
    })
  }

  const handleDeleteClick = (ad) => {
    setSelectedAd(ad)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    // Handle delete logic here
    setDeleteDialogOpen(false)
    setSelectedAd(null)
  }

  return (
    <>
      <ProfileHeader />
      <Container className="content">
        <TabNavigation value={value} handleChange={handleChange} />

        {value === 0 && (
          <Info profileData={user} onClick={handleEditDialogOpen} />
        )}

        {value === 1 && (
          <Grid container spacing={3}>
            <Grid size={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h5">Мої оголошення</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<span className="material-icons">add</span>}
                  component={Link}
                  to="/profile/create-ad"
                >
                  Створити нове оголошення
                </Button>
              </Box>
              {advertisements.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  handleDeleteClick={handleDeleteClick}
                />
              ))}
            </Grid>
          </Grid>
        )}

        {value === 2 && (
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Налаштування профілю
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: '10px' }}
              onClick={handleEditDialogOpen}
            >
              Редагувати профіль
            </Button>
            <Button variant="contained" color="secondary">
              Змінити пароль
            </Button>
          </Paper>
        )}
        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          selectedAd={selectedAd}
          onConfirm={handleDeleteConfirm}
        />

        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Редагувати профіль</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Ім'я та прізвище"
              type="text"
              fullWidth
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Місце проживання"
              type="text"
              fullWidth
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Телефон"
              type="tel"
              fullWidth
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Про мене"
              multiline
              rows={4}
              fullWidth
              name="about"
              value={profileData.about}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose}>Скасувати</Button>
            <Button
              onClick={handleProfileUpdate}
              variant="contained"
              color="primary"
            >
              Зберегти
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  )
}
Profile.propTypes = {}
export default Profile
