import { Fragment } from "react";
import { Typography, Container, Grid2, IconButton } from "@mui/material";
import "../assets/css/footer.css";

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer">
        <Container>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body2">
                Platform for uniting and supporting Ukrainians in Europe
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">
                Email: info@ukrainians-in-europe.com
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom>
                Social Media
              </Typography>
              <IconButton color="primary">
                <span className="material-icons">facebook</span>
              </IconButton>
              <IconButton color="primary">
                <span className="material-icons">twitter</span>
              </IconButton>
              <IconButton color="primary">
                <span className="material-icons">instagram</span>
              </IconButton>
            </Grid2>
          </Grid2>
          <Typography variant="body2" sx={{ mt: 20, textAlign: "center" }}>
            © 2024 Ukrainians in Europe. All rights reserved.
          </Typography>
        </Container>
      </footer>
    </Fragment>
  );
};
export default Footer;