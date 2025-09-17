import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'
const apiUrl = import.meta.env.VITE_APP_API_URL

// import { ads } from "../components";

const GridView = ({ ads }) => (
  <Grid container spacing={4}>
    {ads.map((ad, index) => {
      console.log('🚀 ~ {ads.map ~ ad:', ad)
      let serverPath = ad.photos[0]
      const clientPath = serverPath.replace('public', '')
      console.log('🚀 ~ clientPath:', clientPath)
      return (
        <Grid
          key={index}
          size={{ xs: 12, sm: 6, md: 4 }}
          component={Link}
          to={`/ads/${ad.id}`}
          sx={{ textDecoration: 'none' }}
        >
          <Card className="ad-card">
            <CardMedia
              component="img"
              className="ad-image"
              image={`${apiUrl}${clientPath}`}
              alt={ad.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {ad.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {ad.description}
              </Typography>
              <Chip
                icon={<span className="material-icons">category</span>}
                label={ad.category}
                style={{ margin: '5px' }}
              />
              <Chip
                icon={<span className="material-icons">location_on</span>}
                label={ad.location}
                style={{ margin: '5px' }}
              />
              <Chip
                icon={<span className="material-icons">event</span>}
                label={new Date(ad.date).toLocaleDateString('uk-UA')}
                style={{ margin: '5px' }}
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
      )
    })}
  </Grid>
)

export default GridView
