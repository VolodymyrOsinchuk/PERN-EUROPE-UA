// ProfileHeader.js
import React from 'react'
import { Avatar, Typography, Container } from '@mui/material'
import { useProfileContext } from '../layouts/ProfileLayout'

const ProfileHeader = () => {
  const { user } = useProfileContext()
  // console.log('🚀 ~ Profile ~  user:', user)
  return (
    <div className="profile-header">
      <Container style={{ textAlign: 'center' }}>
        <Avatar
          src="https://avatar.iran.liara.run/public"
          alt="Профіль користувача"
          className="profile-avatar"
          style={{ width: 150, height: 150, margin: '0 auto 20px' }}
        />
        <Typography variant="h4" gutterBottom>
          {user.firstName + ' ' + user.lastName}
        </Typography>
        <Typography variant="subtitle1">
          Місце проживання:{user.city + ' ' + user.country}
        </Typography>
      </Container>
    </div>
  )
}

export default ProfileHeader
