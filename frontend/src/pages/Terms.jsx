import { Box, Container, Typography } from "@mui/material";

export default function Terms() {
  return (
    <Box sx={{ minHeight: "70vh", bgcolor: "#f8fafc", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={800} mb={3} sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
          Умови користування
        </Typography>
        <Typography paragraph>
          Використовуючи платформу «Українці в Європі», користувач погоджується
          додавати достовірну інформацію, не порушувати права інших осіб і не
          використовувати сервіс для шахрайства, спаму чи незаконних дій.
        </Typography>
        <Typography variant="h6" fontWeight={700} mt={3} mb={1}>
          Оголошення
        </Typography>
        <Typography paragraph>
          Користувач відповідає за зміст, ціни, фотографії та достовірність своїх
          оголошень. Адміністрація може приховувати або видаляти контент, що
          порушує правила платформи.
        </Typography>
        <Typography variant="h6" fontWeight={700} mt={3} mb={1}>
          Безпека
        </Typography>
        <Typography paragraph>
          Не передавайте паролі або повні платіжні реквізити через публічні поля.
          Для транзакцій обирайте перевірені способи оплати та зустрічайтеся у
          безпечному місці.
        </Typography>
        <Typography variant="h6" fontWeight={700} mt={3} mb={1}>
          Контакт
        </Typography>
        <Typography>
          Питання щодо цих умов можна надіслати через сторінку «Контакт».
        </Typography>
      </Container>
    </Box>
  );
}
