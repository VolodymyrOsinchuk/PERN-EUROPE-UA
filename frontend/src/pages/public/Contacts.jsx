import { useState } from "react";
import { HeroSection } from "../../components";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import "../../assets/css/contact.css";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    // Assuming there is a /contact endpoint or similar
    // await customFetch.post("/contact", data);
    toast.success(
      "Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.",
    );
    return { success: true };
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка при відправці повідомлення",
    );
    return { error: error?.response?.data?.message || "Error" };
  }
};

const Contacts = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <HeroSection
        title="Контакти"
        typedStrings={["Зв'яжіться з нами!!!"]}
        subtitle="Маєте питання чи пропозиції? Ми завжди раді вам допомогти!"
        buttonText="Надіслати повідомлення"
        buttonLink="/contact"
        textAlign="left"
      />
      <Container className="content">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              className="contact-form"
              style={{ padding: "20px" }}
            >
              <Typography variant="h5" gutterBottom>
                Форма зворотного зв'язку
              </Typography>
              {actionData?.success && (
                <Alert severity="success" style={{ marginBottom: "20px" }}>
                  Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим
                  часом.
                </Alert>
              )}
              {actionData?.error && (
                <Alert severity="error" style={{ marginBottom: "20px" }}>
                  {actionData.error}
                </Alert>
              )}
              <Form method="post">
                <TextField
                  fullWidth
                  label="Ім'я"
                  name="name"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Тема"
                  name="subject"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Повідомлення"
                  name="message"
                  multiline
                  rows={4}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  style={{ marginTop: "20px" }}
                >
                  {isSubmitting ? "Відправка..." : "Надіслати"}
                </Button>
              </Form>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} className="contact-info">
              <Typography variant="h5" gutterBottom>
                Наші контакти
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <span
                  className="material-icons"
                  style={{ marginRight: "10px" }}
                >
                  email
                </span>
                <Typography>info@ukrainians-in-europe.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <span
                  className="material-icons"
                  style={{ marginRight: "10px" }}
                >
                  location_on
                </span>
                <Typography>Європейський офіс: Варшава, Польща</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <span
                  className="material-icons"
                  style={{ marginRight: "10px" }}
                >
                  schedule
                </span>
                <Typography>
                  Графік роботи: Пн-Пт, 9:00 - 18:00 (CET)
                </Typography>
              </Box>
              <Typography
                variant="h6"
                style={{ marginTop: "20px", marginBottom: "10px" }}
              >
                Слідкуйте за нами:
              </Typography>
              <Box>
                <IconButton
                  color="primary"
                  href="https://facebook.com/ukrainians-in-europe"
                >
                  <span className="material-icons">facebook</span>
                </IconButton>
                <IconButton
                  color="primary"
                  href="https://twitter.com/ukrainians_eu"
                >
                  <span className="material-icons">twitter</span>
                </IconButton>
                <IconButton
                  color="primary"
                  href="https://instagram.com/ukrainians_in_europe"
                >
                  <span className="material-icons">instagram</span>
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default Contacts;
