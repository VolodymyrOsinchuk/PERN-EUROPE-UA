import PropTypes from 'prop-types'
import {
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  TextField,
  Chip,
  IconButton,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import '../assets/css/publications.css'
import { HeroSection } from '../components'
const Publications = (props) => {
  const categories = [
    'Всі публікації',
    'Документи',
    'Робота',
    'Житло',
    'Освіта',
    'Медицина',
    'Культура',
    'Інтеграція',
  ]

  const articles = [
    {
      title: 'Як отримати дозвіл на проживання в Німеччині',
      category: 'Документи',
      date: '15.10.2023',
      author: 'Марія Петренко',
      image: 'https://example.com/germany-residence.jpg',
      description:
        'Покроковий гід з отримання дозволу на проживання в Німеччині: необхідні документи, терміни та особливості процесу.',
      readTime: '12 хв',
    },
    {
      title: 'ТОП-10 сайтів для пошуку роботи в Польщі',
      category: 'Робота',
      date: '12.10.2023',
      author: 'Олександр Коваленко',
      image: 'https://example.com/work-search.jpg',
      description:
        'Огляд найефективніших платформ для пошуку роботи в Польщі. Поради щодо створення резюме та проходження співбесід.',
      readTime: '8 хв',
    },
    {
      title: 'Медичне страхування в країнах ЄС',
      category: 'Медицина',
      date: '10.10.2023',
      author: 'Ірина Василенко',
      image: 'https://example.com/healthcare.jpg',
      description:
        "Все про системи охорони здоров'я в різних країнах ЄС, види страховок та як ними користуватися.",
      readTime: '15 хв',
    },
    {
      title: 'Освіта за кордоном: можливості для українських студентів',
      category: 'Освіта',
      date: '08.10.2023',
      author: 'Павло Мельник',
      image: 'https://example.com/education.jpg',
      description:
        'Огляд стипендіальних програм, грантів та можливостей навчання для українських студентів в європейських університетах.',
      readTime: '10 хв',
    },
  ]
  return (
    <>
      <HeroSection
        title="Публікації"
        typedStrings={['Корисні статті']}
        subtitle="Корисні статті, дослідження та матеріали про життя українців у Європі"
        buttonText="Читати статті"
        buttonLink="/публікації"
        textAlign="left"
      />
      <Container style={{ marginTop: '30px', marginBottom: '50px' }}>
        <Typography textAlign="center" variant="h4" gutterBottom>
          Публікації
        </Typography>

        <div className="search-bar">
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Пошук публікацій"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <span
                      className="material-icons"
                      style={{ marginRight: '8px' }}
                    >
                      search
                    </span>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    className="category-chip"
                    color={
                      category === 'Всі публікації' ? 'primary' : 'default'
                    }
                  />
                ))}
              </div>
            </Grid>
          </Grid>
        </div>

        <Grid container spacing={3}>
          {articles.map((article, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card className="article-card">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {article.date} · {article.readTime} читання
                  </Typography>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Автор: {article.author}
                  </Typography>
                  <Chip
                    label={article.category}
                    size="small"
                    style={{ marginBottom: '12px' }}
                  />
                  <Typography variant="body2" component="p">
                    {article.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Читати далі
                  </Button>
                  <IconButton size="small">
                    <span className="material-icons">bookmark_border</span>
                  </IconButton>
                  <IconButton size="small">
                    <span className="material-icons">share</span>
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button variant="outlined" color="primary">
            Завантажити більше
          </Button>
        </div>
      </Container>
    </>
  )
}
Publications.propTypes = {}
export default Publications
