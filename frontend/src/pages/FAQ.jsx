import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ_ITEMS = [
  ["Як опублікувати оголошення?", "Увійдіть в акаунт, відкрийте «Мої оголошення» та натисніть «Нове оголошення». Заповніть основну інформацію, додайте фото і надішліть оголошення на модерацію."],
  ["Як зв’язатися з продавцем?", "На детальній сторінці оголошення натисніть «Написати в чаті» або скористайтеся доступними засобами зв’язку продавця."],
  ["Чому оголошення не видно всім?", "Нові оголошення проходять модерацію. Перед публікацією перевірте текст, фотографії та наявність контактних даних."],
  ["Як видалити оголошення?", "Відкрийте «Мій профіль» → «Мої оголошення», знайдіть потрібне оголошення і натисніть «Видалити». Перед видаленням система запитає підтвердження."],
  ["Як поскаржитися?", "На детальній сторінці оголошення натисніть «Поскаржитися» та оберіть причину."],
  ["Як зберегти оголошення?", "Натисніть значок закладки на картці або детальній сторінці. Сторінка «Обрані» доступна у меню профілю."],
];

export default function FAQ() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h3" fontWeight={800} mb={2} sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
        Часті питання
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Короткі відповіді на основні питання про оголошення та акаунт.
      </Typography>
      {FAQ_ITEMS.map(([question, answer]) => (
        <Accordion key={question} disableGutters sx={{ mb: 1, borderRadius: "12px", "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>{question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
