import { IconButton, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const Info = ({ profileData, onClick }) => {
  return (
    <>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Особиста інформація
              <IconButton
                color="primary"
                style={{ marginLeft: "10px" }}
                onClick={onClick}
              >
                <span className="material-icons">edit</span>
              </IconButton>
            </Typography>
            <Typography variant="body1">Email: {profileData.email}</Typography>
            <Typography variant="body1">
              Телефон: {profileData.phone}
            </Typography>
            <Typography variant="body1">Дата реєстрації: 15.03.2023</Typography>
            <Typography variant="body1">
              Про мене: {profileData.about}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
export default Info;
