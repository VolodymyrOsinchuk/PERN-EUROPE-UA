// Default React import removed - automatic JSX runtime in use
import { Container, Box, Typography, List, ListItem } from "@mui/material";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Загальні положення",
      content:
        'Ця Політика конфіденційності пояснює, як сайт "Українці в Європі" збирає, використовує та захищає інформацію, яку ви надаєте при використанні нашого веб-сайту.',
    },
    {
      title: "2. Збір інформації",
      content: "Ми збираємо інформацію, яку ви добровільно надаєте нам при:",
      list: [
        "Реєстрації на сайті",
        "Створенні оголошень",
        "Заповненні форм зворотного зв'язку",
        "Підписці на розсилку",
      ],
    },
    {
      title: "3. Використання інформації",
      content:
        "Ми використовуємо інформацію для: надання та покращення послуг, комунікування з вами, персоналізації вашого досвіду, забезпечення безпеки та передсądження шахрайства.",
    },
    {
      title: "4. Розподілення інформації",
      content:
        "Ми не продаємо та не передаємо вашу особисту інформацію третім сторонам без вашої згоди, окрім випадків, необхідних для надання послуг (наприклад, платіжні системи) або вимоги законодавства.",
    },
    {
      title: "5. Cookie та подібні технології",
      content:
        "Сайт використовує такі технології. Вони вказані тут як фактично використовувані:",
      list: [
        "token — HttpOnly cookie з ознакою входу в акаунт. Необхідний для автентифікації та безпеки. Зберігається 24 години.",
        "uve_cookie_consent (localStorage) — зберігає ваш вибір щодо cookie, версію налаштувань і дату вибору. Необхідний, щоб не показувати банер повторно. Зберігається до 12 місяців або до зміни вибору.",
        "pern_europe_ua_favorites (localStorage) — список збережених оголошень. Створюється лише за вашою дією («Зберегти») і зберігається, доки ви не видалите їх.",
      ],
    },
    {
      title: "6. Категорії та керування згодою",
      content:
        "Необхідні cookie завжди увімкнені. Аналітичні та маркетингові cookie вимкнені за замовчуванням і вмикаються лише після вашої явної згоди. Наразі на сайті не використовуються сторонні аналітичні чи рекламні сервіси. Якщо це зміниться, ми оновимо цю політику та запитаємо згоду до запуску таких сервісів. Змінити або відкликати згоду можна кнопкою «Налаштування cookie» у лівому нижньому куті сайту. Також можна видалити cookie і дані сайту в налаштуваннях браузера; це може завершити сеанс входу.",
    },
    // Add other sections similarly...
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f7f7" }}>
      <Box
        sx={{
          background: "linear-gradient(45deg, #FFD700, #0057B8)",
          py: 6,
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ color: "white" }}>
          Політика конфіденційності
        </Typography>
      </Box>

      <Container
        maxWidth="md"
        sx={{ backgroundColor: "white", p: 4, borderRadius: 2, boxShadow: 1 }}
      >
        {sections.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              {section.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {section.content}
            </Typography>
            {section.list && (
              <List sx={{ pl: 3 }}>
                {section.list.map((item, i) => (
                  <ListItem
                    key={i}
                    sx={{ fontSize: "0.875rem", color: "gray" }}
                  >
                    {item}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ))}

        <Box sx={{ mt: 6, borderTop: 1, pt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            7. Контакти
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Якщо у вас є питання щодо цієї політики конфіденційності, будь
            ласка, зв'яжіться з нами:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Email: privacy@ukrainians-in-europe.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
