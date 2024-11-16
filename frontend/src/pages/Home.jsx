import PropTypes from "prop-types";
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

import "../assets/css/home.css";
const Home = (props) => {
  return (
    <>
      <div className="hero">
        <Container>
          <Typography variant="h2" gutterBottom>
            Ukrainians in Europe
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your guide to European life
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: 20 }}
          >
            Join the community
          </Button>
        </Container>
      </div>

      <div className="search-section">
        <Container>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search for services, events or information..."
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" color="primary" fullWidth>
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>

      <Container className="latest-posts">
        <Typography variant="h4" className="section-title">
          Main Categories
        </Typography>
      </Container>
    </>
  );
};
Home.propTypes = {};
export default Home;
