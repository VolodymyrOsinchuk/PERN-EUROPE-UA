import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '../components'
import { Stack } from '@mui/material'
import { useProfileContext } from './ProfileLayout'
import { CookieBanner } from '../components'
const HomeLayout = () => {
  const item = useProfileContext()

  const handleCookieAccept = () => {
    console.log('Cookies accepted')
  }

  return (
    <>
      <Navbar />
      <Stack
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          bgcolor: '#f5f5f5',
          pb: 4,
        }}
        component="main"
      >
        <Outlet />
      </Stack>
      <Footer />
      <CookieBanner onAccept={handleCookieAccept} />
    </>
  )
}
export default HomeLayout
