import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import {
  Button,
  Typography,
  Container,
  TextField,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import "../assets/css/register.css";
const Register = (props) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    city: "",
    interests: [],
    agreeToTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "agreeToTerms" ? checked : value,
    }));
  };

  return (
    <Fragment>
      <div className="hero">
        <Container>
          <Typography variant="h3" gutterBottom>
            Приєднайтеся до нашої спільноти
          </Typography>
          <Typography variant="h6">
            Створіть свій профіль та отримайте доступ до всіх можливостей
            платформи
          </Typography>
        </Container>
      </div>

      <Container>
        <Paper className="registration-form" elevation={3}>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <TextField
                fullWidth
                label="Ім'я"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <TextField
                fullWidth
                label="Прізвище"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <TextField
                fullWidth
                type="password"
                label="Пароль"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <FormControl fullWidth>
                <InputLabel>Країна проживання</InputLabel>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="poland">Польща</MenuItem>
                  <MenuItem value="germany">Німеччина</MenuItem>
                  <MenuItem value="france">Франція</MenuItem>
                  <MenuItem value="italy">Італія</MenuItem>
                  <MenuItem value="spain">Іспанія</MenuItem>
                  <MenuItem value="other">Інша країна</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="form-field">
              <TextField
                fullWidth
                label="Місто"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                }
                label="Я погоджуюся з умовами використання та політикою конфіденційності"
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Зареєструватися
            </Button>
            <Typography
              variant="body2"
              style={{ marginTop: "20px", textAlign: "center" }}
            >
              Вже маєте аккаунт?{" "}
              <Button color="primary" component={Link} to="/login">
                Увійти
              </Button>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Fragment>
  );
};
Register.propTypes = {};
export default Register;
