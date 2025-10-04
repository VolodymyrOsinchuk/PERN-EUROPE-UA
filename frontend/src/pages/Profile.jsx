import { useState, useEffect } from 'react'
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
import Grid from '@mui/material/Grid'
import Info from '../components/Info'
import ProfileHeader from '../components/ProfileHeader'
import AdCard from '../components/AdCard'
import TabNavigation from '../components/TabNavigation'
import DeleteDialog from '../components/DeleteDialog'
import '../assets/css/profile.css'
import {
  Link,
  useNavigate,
  useOutletContext,
  Form,
  useActionData,
  useLoaderData,
  useFetcher,
} from 'react-router-dom'
import { useProfileContext } from '../layouts/ProfileLayout'
import customFetch from '../utils/customFetch'
import { toast } from 'react-toastify'

// Action pour mettre à jour le profil
export async function action({ request }) {
  const formData = await request.formData()
  const actionType = formData.get('actionType')

  try {
    switch (actionType) {
      case 'updateProfile': {
        const profileData = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phoneNumber: formData.get('phoneNumber'),
          country: formData.get('country'),
          state: formData.get('state'),
          location: formData.get('location'),
          about: formData.get('about'),
        }
        const userId = formData.get('userId')
        const { data } = await customFetch.put(`/users/${userId}`, profileData)
        return { success: true, data, message: 'Profile updated successfully!' }
      }

      case 'updatePassword': {
        const passwordData = {
          oldPassword: formData.get('oldPassword'),
          newPassword: formData.get('newPassword'),
        }
        await customFetch.patch('/users/update-password', passwordData)
        return { success: true, message: 'Password updated successfully!' }
      }

      case 'deleteAccount': {
        const userId = formData.get('userId')
        await customFetch.delete(`/users/${userId}`)
        return {
          success: true,
          message: 'Account deleted successfully!',
          redirect: '/register',
        }
      }

      case 'deleteAd': {
        const adId = formData.get('adId')
        await customFetch.delete(`/ads/${adId}`)
        return { success: true, message: 'Advertisement deleted successfully!' }
      }

      default:
        return { success: false, message: 'Unknown action type' }
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.msg || 'An error occurred',
    }
  }
}

// Loader pour récupérer les données du profil et les annonces
export async function profileLoader({ params }) {
  try {
    // Récupérer les annonces de l'utilisateur depuis la base de données
    const { data: ads } = await customFetch.get('/ads/user-ads')
    console.log('ads from loader:', ads)
    return { ads }
  } catch (error) {
    console.error('Error loading profile data:', error)
    return { ads: [] }
  }
}

const Profile = () => {
  const {
    user,
    logoutUser,
    updateUser: updateContextUser,
  } = useProfileContext()

  const navigate = useNavigate()
  const actionData = useActionData()
  const { ads } = useLoaderData() || { ads: [] }
  const fetcher = useFetcher()
  const profileData = useOutletContext()

  const [profileImage, setProfileImage] = useState(user?.profilePicture || '')
  const [value, setValue] = useState(0)
  const [languageAnchor, setLanguageAnchor] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || '',
    state: user?.state || '',
    location: user?.location || '',
    about: user?.about || '',
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  })

  // Gérer les réponses des actions
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success(actionData.message)

        if (actionData.data) {
          updateContextUser(actionData.data)
        }

        if (actionData.redirect) {
          logoutUser()
          navigate(actionData.redirect)
        }

        // Fermer les dialogs après succès
        setEditDialogOpen(false)
        setPasswordDialogOpen(false)
        setDeleteAccountDialogOpen(false)
        setDeleteDialogOpen(false)
      } else {
        toast.error(actionData.message)
      }
    }
  }, [actionData, updateContextUser, logoutUser, navigate])

  useEffect(() => {
    if (user?.profilePicture) {
      setProfileImage(user.profilePicture)
    }
  }, [user?.profilePicture])

  // Synchroniser les données utilisateur avec le formulaire
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
        state: user.state || '',
        location: user.location || '',
        about: user.about || '',
      })
    }
  }, [user])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('profilePicture', file)

    try {
      const { data } = await customFetch.post(
        '/users/upload-profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      setProfileImage(data.profilePicture)
      updateContextUser({ ...user, profilePicture: data.profilePicture })
      toast.success('Profile picture updated successfully!')
    } catch (error) {
      toast.error(
        error?.response?.data?.msg || 'Failed to update profile picture'
      )
    }
  }

  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true)
  }

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false)
    setPasswordData({ oldPassword: '', newPassword: '' })
  }

  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleDeleteAccountDialogOpen = () => {
    setDeleteAccountDialogOpen(true)
  }

  const handleDeleteAccountDialogClose = () => {
    setDeleteAccountDialogOpen(false)
  }

  const handleDeleteClick = (ad) => {
    setSelectedAd(ad)
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <ProfileHeader
        profileImage={profileImage}
        handleImageChange={handleImageChange}
      />
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
              {ads && ads.length > 0 ? (
                ads.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    handleDeleteClick={handleDeleteClick}
                  />
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  У вас поки немає оголошень
                </Typography>
              )}
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
            <Button
              variant="contained"
              color="secondary"
              style={{ marginRight: '10px' }}
              onClick={handlePasswordDialogOpen}
            >
              Змінити пароль
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccountDialogOpen}
            >
              Видалити аккаунт
            </Button>
          </Paper>
        )}

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          selectedAd={selectedAd}
          onConfirm={() => {
            if (selectedAd) {
              fetcher.submit(
                {
                  actionType: 'deleteAd',
                  adId: selectedAd.id,
                },
                { method: 'post' }
              )
            }
          }}
        />

        {/* Dialog pour éditer le profil */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <Form method="post">
            <input type="hidden" name="actionType" value="updateProfile" />
            <input type="hidden" name="userId" value={user?.id} />

            <DialogTitle>Редагувати профіль</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Ім'я"
                type="text"
                fullWidth
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Прізвище"
                type="text"
                fullWidth
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Телефон"
                type="tel"
                fullWidth
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Країна"
                type="text"
                fullWidth
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Область/Штат"
                type="text"
                fullWidth
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Місто"
                type="text"
                fullWidth
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Про мене"
                multiline
                rows={4}
                fullWidth
                name="about"
                value={formData.about}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditDialogClose}>Скасувати</Button>
              <Button type="submit" variant="contained" color="primary">
                Зберегти
              </Button>
            </DialogActions>
          </Form>
        </Dialog>

        {/* Dialog pour changer le mot de passe */}
        <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
          <Form method="post">
            <input type="hidden" name="actionType" value="updatePassword" />

            <DialogTitle>Змінити пароль</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Поточний пароль"
                type="password"
                fullWidth
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordInputChange}
              />
              <TextField
                margin="dense"
                label="Новий пароль"
                type="password"
                fullWidth
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePasswordDialogClose}>Скасувати</Button>
              <Button type="submit" variant="contained" color="primary">
                Зберегти
              </Button>
            </DialogActions>
          </Form>
        </Dialog>

        {/* Dialog pour supprimer le compte */}
        <Dialog
          open={deleteAccountDialogOpen}
          onClose={handleDeleteAccountDialogClose}
        >
          <Form method="post">
            <input type="hidden" name="actionType" value="deleteAccount" />
            <input type="hidden" name="userId" value={user?.id} />

            <DialogTitle>Видалити аккаунт</DialogTitle>
            <DialogContent>
              <Typography>
                Ви впевнені, що хочете видалити свій аккаунт?
              </Typography>
              <Typography color="error">Цю дію не можна скасувати.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteAccountDialogClose}>
                Скасувати
              </Button>
              <Button type="submit" variant="contained" color="error">
                Видалити
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      </Container>
    </>
  )
}

Profile.propTypes = {}
export default Profile
