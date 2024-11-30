import {
  Grid2,
  Card,
  CardContent,
  IconButton,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

// Sections Component
const SectionsGrid = () => {
  const sections = [
    {
      title: "Новини",
      icon: "article",
      description: "Останні новини та події для українців у Європі",
      link: "/новини",
    },
    {
      title: "Афіша",
      icon: "event",
      description: "Культурні заходи та події української діаспори",
      link: "/афіша",
    },
    {
      title: "Публікації",
      icon: "library_books",
      description: "Корисні статті та інформація для життя за кордоном",
      link: "/публікації",
    },
    {
      title: "Форум",
      icon: "forum",
      description: "Спілкування та обмін досвідом з іншими українцями",
      link: "/форум",
    },
  ];

  return (
    <Grid2 container spacing={4} mt={2}>
      {sections.map((section) => (
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={section.title}>
          <Card
            sx={{
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <IconButton
                color="primary"
                sx={{
                  backgroundColor: "#f0f0f0",
                  marginBottom: "15px",
                }}
              >
                <span className="material-icons">{section.icon}</span>
              </IconButton>
              <Typography variant="h5" component="div" gutterBottom>
                {section.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {section.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" href={section.link}>
                Перейти
              </Button>
            </CardActions>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default SectionsGrid;
