import { Fragment } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "../assets/css/footer.css";

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer">
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body2">
                Platform for uniting and supporting Ukrainians in Europe
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">
                Email: info@ukrainians-in-europe.com
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
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
            </Grid>
          </Grid>
          <Typography
            variant="body2"
            style={{ marginTop: 20, textAlign: "center" }}
          >
            © 2023 Ukrainians in Europe. All rights reserved.
          </Typography>
        </Container>
      </footer>
    </Fragment>
  );
};
export default Footer;
