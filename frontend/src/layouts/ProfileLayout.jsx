import { createContext, useContext, useState, useCallback } from 'react';
import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { Loading, Navbar } from '../components';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    console.log('🚀 ~ loader ~  data:', data);
    return data;
  } catch (error) {
    console.log('🚀 ~ loader ~ error:', error);
    toast.error(error?.response?.data?.error || error?.response?.data?.message);
    return redirect('/login');
  }
};

const ProfileContext = createContext();
const ProfileLayout = () => {
  const initialUser = useLoaderData();
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      toast.success('Logged out successfully...');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
  }, []);

  return (
    <ProfileContext.Provider value={{ user, logoutUser, updateUser }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Navbar user={user} />
        {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
      </Box>
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext)
export default ProfileLayout
