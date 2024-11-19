import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Typography,
  Container,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
  RegionSelect,
  LanguageSelect,
} from "react-country-state-city";
import "../assets/css/create-ad.css";
import "react-country-state-city/dist/react-country-state-city.css";

const CreateAdPage = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    contactMethod: "",
    region: "",
    country: "",
    state: "",
    city: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  //  const handleImageUpload = (e) => {
  //    const files = Array.from(e.target.files);
  //    setFormData((prev) => ({
  //      ...prev,
  //      images: files,
  //    }));
  //  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  //   // Here you would typically send the data to your backend
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => {
          formDataToSend.append("images", file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        // Gérer la réussite
        console.log("Annonce créée avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la création", error);
    }
  };

  return (
    <Fragment>
      <div className="page-header">
        <Typography variant="h4" gutterBottom>
          Створити нове оголошення
        </Typography>
      </div>

      <Paper className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Заголовок оголошення"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Категорія</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Категорія"
                  required
                >
                  <MenuItem value="job">Робота</MenuItem>
                  <MenuItem value="housing">Житло</MenuItem>
                  <MenuItem value="services">Послуги</MenuItem>
                  <MenuItem value="events">Події</MenuItem>
                  <MenuItem value="sale">Продаж</MenuItem>
                  <MenuItem value="other">Інше</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <RegionSelect
              placeHolder="Sélectionner un region"
              onChange={(e) => {
                console.log("🚀 ~ CreateAdPage ~ e):", e);

                setFormData((prev) => ({ ...prev, region: e.name }));
                // setCountryCode(e.iso3);
              }}
            />
            <CountrySelect
              placeHolder="Sélectionner un pays"
              // onChange={(e) => {
              //   console.log("🚀 ~ CreateAdPage ~ e):", e);

              //   setFormData((prev) => ({ ...prev, country: e.id }));

              //   setCountryCode(e.iso3);
              // }}
              onChange={(e) => {
                console.log("🚀 ~ Country  Select ~ e:", e);

                setCountryId(e.id);
              }}
              region={formData.region}
            />
            <h6>Phone Code</h6>
            <RegionSelect
              onChange={(e) => {
                console.log("🚀 ~ CreateAdPage ~ e_phone_code:", e);

                setPhoneCode(e.phone_code);
              }}
              placeHolder="Select Phone Code"
            />
            <StateSelect
              countryid={countryId}
              placeHolder="Sélectionner une région"
              // onChange={(e) => {
              //   console.log("🚀 ~ CreateAdPage ~ e:", e);
              //   setFormData((prev) => ({ ...prev, state: e.id }));
              //   setStateCode(e.state_code);
              // }}
              onChange={(e) => {
                console.log("🚀 ~ State Select ~ e:", e);

                setStateId(e.id);
              }}
            />

            <CitySelect
              countryid={countryId}
              stateid={stateId}
              placeHolder="Sélectionner une ville"
              onChange={(e) => {
                console.log("🚀 ~ CreateAdPage ~ e CitySelect:", e);

                // setFormData((prev) => ({ ...prev, city: e.name }));
              }}
            />
            <LanguageSelect
              onChange={(e) => {
                console.log("langage select", e);
              }}
              placeHolder="Select Language"
            />

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Опис"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ціна (якщо є)"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Місто"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Контактна інформація"
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleInputChange}
                required
                helperText="Вкажіть телефон, email або інший спосіб зв'язку"
              />
            </Grid>
            <Grid size={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <div className="image-upload-container">
                  <span
                    className="material-icons"
                    style={{ fontSize: 48, color: "#666" }}
                  >
                    add_photo_alternate
                  </span>
                  <Typography variant="body1" gutterBottom>
                    Додати фотографії
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Клікніть або перетягніть файли сюди
                  </Typography>
                </div>
              </label>
              {previewImages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {previewImages.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                  ))}
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" href="/профіль">
                  Скасувати
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<span className="material-icons">send</span>}
                >
                  Опублікувати
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Fragment>
  );
};
CreateAdPage.propTypes = {};
export default CreateAdPage;
