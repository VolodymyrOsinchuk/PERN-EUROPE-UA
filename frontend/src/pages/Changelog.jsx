import { Container, Paper, Typography } from "@mui/material";

const releases = [
  {
    date: "18 листопада 2026",
    title: "Профіль і обране",
    items: [
      "Додано публічні профілі продавців.",
      "Обране тепер прив’язане до акаунта.",
      "Додано інформацію про останній вхід у таблицю користувачів.",
    ],
  },
  {
    date: "Раніше",
    title: "Модерація та спільнота",
    items: [
      "Додано модерацію оголошень.",
      "Додано повідомлення, скарги та сповіщення.",
      "Додано сторінки FAQ і умов використання.",
    ],
  },
];

export default function Changelog() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Typography variant="h3" fontWeight={800} mb={1} sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
        Що нового
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Коротка історія важливих оновлень платформи.
      </Typography>
      {releases.map((release) => (
        <Paper key={release.title} sx={{ p: 3, mb: 2.5, borderRadius: "16px" }}>
          <Typography variant="caption" color="primary" fontWeight={700}>
            {release.date}
          </Typography>
          <Typography variant="h6" fontWeight={800} mt={0.5} mb={1}>
            {release.title}
          </Typography>
          {release.items.map((item) => (
            <Typography key={item} component="div" sx={{ mb: 0.5 }}>
              • {item}
            </Typography>
          ))}
        </Paper>
      ))}
    </Container>
  );
}
