import { createContext, useContext } from 'react'
import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router-dom'
import customFetch from '../utils/customFetch'
import { Loading, Navbar } from '../components'
import { toast } from 'react-toastify'
import { Box } from '@mui/material'

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user')
    console.log('🚀 ~ loader ~  data:', data)
    return data
  } catch (error) {
    console.log('🚀 ~ loader ~ error:', error)
    toast.error(error?.response?.data?.error || error?.response?.data?.message)
    return redirect('/login')
  }
}

const ProfileContext = createContext()
const ProfileLayout = () => {
  const user = useLoaderData()
  // console.log('🚀 ~ ProfileLayout ~ user :', user)
  const navigate = useNavigate()
  const navigation = useNavigation()
  const isPageLoading = navigation.state === 'loading'

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout')
      toast.success('Logged out successfully...')
      navigate('/')
    } catch (error) {
      // Ajout d'une gestion d'erreur pour le logout
      toast.error('Logout failed. Please try again.')
      console.error('Logout error:', error)
    }
  }

  return (
    <ProfileContext.Provider value={{ user, logoutUser }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Navbar user={user} />
        {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
      </Box>
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => useContext(ProfileContext)
export default ProfileLayout
