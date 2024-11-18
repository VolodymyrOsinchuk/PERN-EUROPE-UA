import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ads } from "../components";

const GridView = () => (
  <Grid container spacing={4}>
    {ads.map((ad, index) => (
      <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
        <Card className="ad-card">
          <CardMedia
            component="img"
            className="ad-image"
            image={ad.image}
            alt={ad.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {ad.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ad.description}
            </Typography>
            <Chip
              icon={<span className="material-icons">category</span>}
              label={ad.category}
              style={{ margin: "5px" }}
            />
            <Chip
              icon={<span className="material-icons">location_on</span>}
              label={ad.location}
              style={{ margin: "5px" }}
            />
            <Chip
              icon={<span className="material-icons">event</span>}
              label={new Date(ad.date).toLocaleDateString("uk-UA")}
              style={{ margin: "5px" }}
            />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Контакти
            </Button>
            <Button size="small" color="primary">
              Поскаржитись
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default GridView;
