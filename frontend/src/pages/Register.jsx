import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, Form, redirect, useNavigation } from "react-router-dom";
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
import customFetch from "../utils/customFetch";
import { FormRow, FormRowSelect } from "../components";
import { toast } from "react-toastify";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
  RegionSelect,
  LanguageSelect,
  GetCountries,
} from "react-country-state-city";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("auth/register", data);
    toast.success("Реєстрація пройшла успішно");
    return redirect("/login");
  } catch (error) {
    console.log("🚀 ~ action ~ error:", error);
    toast.error(error?.response.data?.msg);
    return error;
  }
};

const Register = () => {
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

  const [europeanCountries, setEuropeanCountries] = useState([]);
  const [allCountries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  useEffect(() => {
    const europeanCountries = allCountries.filter((country) => {
      return country.region === "Europe";
    });
    setEuropeanCountries(europeanCountries);
  }, [allCountries]);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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

  useEffect(() => {
    GetCountries().then((result) => {
      setCountries(result);
    });
  }, []);

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
          <Form method="post">
            <FormRow type="text" name="firstName" label="Ім'я" />
            <FormRow type="text" name="lastName" label="Прізвище" />
            <FormRow label="Email" name="email" type="email" />
            <FormRow type="password" label="Пароль" name="password" />

            <FormRowSelect
              // type="text"
              name="country"
              labelText="Країна проживання"
              defaultValue={selectedCountry}
              list={europeanCountries}
              // onChange={handleCountryChange}
            />

            {/* <FormControl fullWidth margin="normal">
              <InputLabel>Країна проживання</InputLabel>
              <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                required
              >
                {europeanCountries.map((country) => {
                  return (
                    <MenuItem key={country.id} value={country.name}>
                      {country.native}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl> */}

            <TextField
              fullWidth
              label="Місто"
              name="city"
              margin="normal"
              // value={formData.city}
              // onChange={handleChange}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  // checked={formData.agreeToTerms}
                  // onChange={handleChange}
                  required
                  margin="normal"
                />
              }
              label="Я погоджуюся з умовами використання та політикою конфіденційності"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
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
          </Form>
        </Paper>
      </Container>
    </Fragment>
  );
};
Register.propTypes = {};
export default Register;
