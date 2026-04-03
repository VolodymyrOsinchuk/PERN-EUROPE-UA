import { Fragment, useEffect, useState } from "react";
import { Link, Form, redirect, useNavigation } from "react-router-dom";
import {
  Button,
  Typography,
  Container,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import "../assets/css/register.css";
import customFetch from "../utils/customFetch";
import { FormRow, FormRowSelect } from "../components";
import { toast } from "react-toastify";
import { GetCountries, GetRegions } from "react-country-state-city";
import { HeroSection } from "../components";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const dataForm = Object.fromEntries(formData);
  // Vérification ou modification des données avant l'envoi si nécessaire
  if (dataForm.agreeToTerms === "on") {
    dataForm.agreeToTerms = true; // Si la case est cochée, on définit agreeToTerms sur true
  } else {
    dataForm.agreeToTerms = false; // Si la case n'est pas cochée, on définit agreeToTerms sur false
  }
  try {
    await customFetch.post("/auth/register", dataForm);

    toast.success("Реєстрація пройшла успішно");
    return redirect(`/register`);
    // return response;
  } catch (error) {
    console.log("🚀 ~ action ~ error:", error);
    toast.error(error?.response?.data?.message || "Сталася помилка");
    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
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

  useEffect(() => {
    const europeanCountries = allCountries.filter((country) => {
      return country.region === "Europe";
    });
    setEuropeanCountries(europeanCountries);
  }, [allCountries]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "agreeToTerms" ? checked : value,
    }));
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const result = await GetCountries();
        setCountries(result);
      } catch (error) {
        console.error("Помилка завантаження країн:", error);
        toast.error("Помилка завантаження країн");
      }
    };
    fetchCountries();
  }, []);

  return (
    <Fragment>
      <HeroSection
        title="Реєстрація"
        typedStrings={["Приєднайтеся до нашої спільноти"]}
        subtitle="Створіть свій профіль та отримайте доступ до всіх можливостей платформи"
        buttonText="На головну сторінку"
        buttonLink="/"
      />

      <Container>
        <Paper className="registration-form" elevation={3}>
          <Form method="post">
            <FormRow type="text" name="firstName" label="Ім'я" />
            <FormRow type="text" name="lastName" label="Прізвище" />
            <FormRow label="Email" name="email" type="email" />
            <FormRow type="password" label="Пароль" name="password" />

            <FormRowSelect
              name="country"
              labelText="Країна проживання"
              defaultValue={selectedCountry}
              list={europeanCountries}
            />
            <TextField fullWidth label="Місто" name="city" margin="normal" />

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  required
                  margin="normal"
                  defaultValue={false}
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
export default Register;
