import { useState } from "react";
import { HeroSection } from "../components";
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
import "../assets/css/contact.css";
const Contacts = () => {
  const [formStatus, setFormStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("success");
    // Here would be the actual form submission logic
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              {formStatus === "success" && (
                <Alert severity="success" style={{ marginBottom: "20px" }}>
                  Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим
                  часом.
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Ім'я"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Тема"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Повідомлення"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{ marginTop: "20px" }}
                >
                  Надіслати
                </Button>
              </form>
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
