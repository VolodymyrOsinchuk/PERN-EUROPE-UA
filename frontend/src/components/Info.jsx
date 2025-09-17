import { IconButton, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'

const Info = ({ profileData, onClick }) => {
  const formattedDate = new Date(profileData.createdAt).toLocaleString(
    'uk-UA',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
  )
  return (
    <>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Особиста інформація
              <IconButton
                color="primary"
                style={{ marginLeft: '10px' }}
                onClick={onClick}
              >
                <span className="material-icons">edit</span>
              </IconButton>
            </Typography>
            <Typography variant="body1">Email: {profileData.email}</Typography>
            {profileData.phoneNumber && (
              <Typography variant="body1">
                Телефон: {profileData.phoneNumber}
              </Typography>
            )}
            <Typography variant="body1">
              Дата реєстрації: {formattedDate}
            </Typography>
            <Typography variant="body1">
              Про мене: {profileData.about}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}
export default Info
