import { Fragment } from "react";
import { HeroSection } from "../components";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import "../assets/css/forum.css";
const Forum = (props) => {
  const categories = [
    {
      title: "Працевлаштування",
      description: "Пошук роботи, резюме, вакансії та поради",
      icon: "work",
      topics: 156,
      posts: 1205,
    },
    {
      title: "Документи та легалізація",
      description: "Візи, дозволи на проживання, громадянство",
      icon: "description",
      topics: 234,
      posts: 1876,
    },
    {
      title: "Житло",
      description: "Оренда, купівля нерухомості, пошук співмешканців",
      icon: "home",
      topics: 189,
      posts: 945,
    },
    {
      title: "Освіта",
      description: "Навчання, курси, визнання дипломів",
      icon: "school",
      topics: 145,
      posts: 678,
    },
    {
      title: "Здоров'я",
      description: "Медичне обслуговування, страхування",
      icon: "local_hospital",
      topics: 98,
      posts: 432,
    },
    {
      title: "Спільнота",
      description: "Зустрічі, заходи, знайомства",
      icon: "groups",
      topics: 267,
      posts: 1543,
    },
  ];

  const recentTopics = [
    {
      title: "Як знайти роботу IT-спеціалісту в Німеччині?",
      author: "Олександр",
      replies: 23,
      views: 456,
      category: "Працевлаштування",
      lastUpdate: "15 хв тому",
    },
    {
      title: "Оренда квартири в Празі: на що звернути увагу",
      author: "Марія",
      replies: 45,
      views: 789,
      category: "Житло",
      lastUpdate: "1 год тому",
    },
    {
      title: "Досвід отримання Blue Card в Нідерландах",
      author: "Петро",
      replies: 34,
      views: 567,
      category: "Документи та легалізація",
      lastUpdate: "3 год тому",
    },
  ];
  return (
    <>
      <HeroSection
        title="Форум"
        typedStrings={["Простір для спілкування"]}
        subtitle="Простір для спілкування, обміну досвідом та підтримки"
        buttonText="Приєднатися до дискусії"
        buttonLink="/forum"
        textAlign="left"
      />
      <Container style={{ marginTop: "30px", marginBottom: "50px" }}>
        <Paper elevation={0} style={{ padding: "20px", marginBottom: "30px" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h4" gutterBottom>
                Форум спільноти
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Обговорюйте важливі теми, діліться досвідом та знаходьте
                відповіді на свої запитання
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<span className="material-icons">add</span>}
              >
                Створити нову тему
              </Button>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Пошук по форуму..."
            style={{ marginTop: "20px" }}
            InputProps={{
              startAdornment: (
                <span
                  className="material-icons"
                  style={{ marginRight: "8px", color: "#666" }}
                >
                  search
                </span>
              ),
            }}
          />
        </Paper>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" gutterBottom>
              Категорії форуму
            </Typography>
            <Paper elevation={1}>
              <List>
                {categories.map((category, index) => (
                  <Fragment key={category.title}>
                    <ListItem className="forum-category">
                      <ListItemIcon>
                        <span
                          className="material-icons"
                          style={{ color: "#1976d2" }}
                        >
                          {category.icon}
                        </span>
                      </ListItemIcon>
                      <ListItemText
                        primary={category.title}
                        secondary={category.description}
                      />
                      <div>
                        <Typography variant="body2" color="textSecondary">
                          Тем: {category.topics}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Повідомлень: {category.posts}
                        </Typography>
                      </div>
                    </ListItem>
                    {index < categories.length - 1 && <Divider />}
                  </Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" gutterBottom>
              Останні обговорення
            </Typography>
            {recentTopics.map((topic) => (
              <Card
                key={topic.title}
                className="topic-card"
                style={{ marginBottom: "15px" }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {topic.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Автор: {topic.author}
                  </Typography>
                  <div style={{ marginTop: "10px" }}>
                    <Chip
                      label={topic.category}
                      size="small"
                      style={{ marginRight: "10px" }}
                    />
                    <Chip
                      icon={<span className="material-icons">forum</span>}
                      label={`${topic.replies} відповідей`}
                      size="small"
                      style={{ marginRight: "10px" }}
                    />
                    <Chip
                      icon={<span className="material-icons">visibility</span>}
                      label={`${topic.views} переглядів`}
                      size="small"
                    />
                  </div>
                </CardContent>
                <CardActions>
                  <Typography variant="caption" color="textSecondary">
                    Оновлено: {topic.lastUpdate}
                  </Typography>
                </CardActions>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default Forum;
