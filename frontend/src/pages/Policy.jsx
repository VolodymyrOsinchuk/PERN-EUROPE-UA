// import React from 'react'
// import { Container, Typography } from '@mui/material'
// import '../assets/css/privacyPolicy.css'
// import { HeroSection } from '../components'

// const PrivacyPolicy = () => {
//   return (
//     <>
//       <HeroSection subtitle="Політика конфіденційності" />
//       <Container className="content-container">
//         <div className="section">
//           <Typography variant="h5" gutterBottom>
//             1. Загальні положення
//           </Typography>
//           <Typography>
//             Ця Політика конфіденційності пояснює, як сайт "Українці в Європі"
//             збирає, використовує та захищає інформацію, яку ви надаєте при
//             використанні нашого веб-сайту.
//           </Typography>
//         </div>

//         <div className="section">
//           <Typography variant="h5" gutterBottom>
//             2. Збір інформації
//           </Typography>
//           <Typography>
//             Ми збираємо інформацію, яку ви добровільно надаєте нам при:
//           </Typography>
//           <Typography component="ul">
//             <li>Реєстрації на сайті</li>
//             <li>Створенні оголошень</li>
//             <li>Заповненні форм зворотного зв'язку</li>
//             <li>Підписці на розсилку</li>
//           </Typography>
//         </div>

//         <div className="section">
//           <Typography variant="h5" gutterBottom>
//             3. Використання інформації
//           </Typography>
//           <Typography>Зібрана інформація використовується для:</Typography>
//           <Typography component="ul">
//             <li>Надання послуг та покращення роботи сайту</li>
//             <li>Персоналізації вашого досвіду</li>
//             <li>Відправки інформаційних повідомлень</li>
//             <li>Обробки ваших запитів</li>
//           </Typography>
//         </div>

//         <div className="section">
//           <Typography variant="h5" gutterBottom>
//             4. Захист інформації
//           </Typography>
//           <Typography>
//             Ми застосовуємо відповідні заходи безпеки для захисту від
//             несанкціонованого доступу, зміни, розкриття або знищення вашої
//             особистої інформації.
//           </Typography>
//         </div>

//         <div className="section">
//           <Typography variant="h5" gutterBottom>
//             5. Cookies
//           </Typography>
//           <Typography>
//             Наш сайт використовує cookies для покращення користувацького
//             досвіду. Ви можете налаштувати свій браузер для відмови від cookies,
//             але це може вплинути на функціональність сайту.
//           </Typography>
//         </div>

//         <div className="section">
//           <Typography variant="h5" gutterBottom>
//             6. Зміни в політиці конфіденційності
//           </Typography>
//           <Typography>
//             Ми маємо за собою право вносити зміни до цієї політики
//             конфіденційності. Будь-які зміни будуть опубліковані на цій
//             сторінці.
//           </Typography>
//         </div>

//         <div className="section">
//           <Typography variant="h5" gutterBottom>
//             7. Контакти
//           </Typography>
//           <Typography>
//             Якщо у вас є питання щодо цієї політики конфіденційності, будь
//             ласка, зв'яжіться з нами:
//           </Typography>
//           <Typography>Email: privacy@ukrainians-in-europe.com</Typography>
//         </div>
//       </Container>
//     </>
//   )
// }

// export default PrivacyPolicy

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
