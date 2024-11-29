import React, { Fragment, useState } from "react";
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
import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
  redirect,
  Link,
} from "react-router-dom";

// Loader function to fetch initial data
export async function createAdLoader() {
  try {
    // Fetch categories, regions, etc.
    const categoriesResponse = await fetch("/api/categories");
    const categories = await categoriesResponse.json();

    return {
      categories,
      // Add other initial data as needed
    };
  } catch (error) {
    console.error("Failed to load create ad page data", error);
    return { categories: {} };
  }
}

// Action function to handle form submission
export async function createAdAction({ request }) {
  const formData = await request.formData();

  // Construct ad data object
  const adData = {
    title: formData.get("title"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    region: formData.get("region"),
    country: formData.get("country"),
    description: formData.get("description"),
    price: formData.get("price") ? Number(formData.get("price")) : null,
    location: formData.get("location"),
    contactMethod: formData.get("contactMethod"),
    images: formData.getAll("images"),
  };

  try {
    // Submit ad to backend
    const response = await fetch("/api/ads", {
      method: "POST",
      body: JSON.stringify(adData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create ad");
    }

    // Redirect to profile or ads list after successful creation
    return redirect("/profile");
  } catch (error) {
    // Handle errors
    return {
      error: "Failed to create ad. Please try again.",
    };
  }
}

const categoriesData = {
  job: {
    label: "Робота",
    subcategories: ["IT", "Медицина", "Витрати"],
  },
  housing: {
    label: "Житло",
    subcategories: ["Оренда", "Продаж"],
  },
  services: {
    label: "Послуги",
    subcategories: ["Прибирання", "Ремонт"],
  },
  events: {
    label: "Події",
    subcategories: ["Концерти", "Виставки"],
  },
  sale: {
    label: "Продаж",
    subcategories: ["Авто", "Нерухомість"],
  },
  other: {
    label: "Інше",
    subcategories: [],
  },
};

const CreateAdPage = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    region: "",
    country: "",
    description: "",
    price: "",
    location: "",
    contactMethod: "",
  });

  // State for preview images
  const [previewImages, setPreviewImages] = useState([]);

  // Get loader data (categories)
  // const { categories } = useLoaderData();

  // Navigation state
  const navigation = useNavigation();

  // Action data (for errors)
  const actionData = useActionData();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  return (
    <Fragment>
      <div className="page-header">
        <Typography variant="h4" gutterBottom>
          Створити нове оголошення
        </Typography>
      </div>

      {/* <Paper className="form-container">
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
                  {Object.entries(categoriesData).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {formData.category && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Підкатегорія</InputLabel>
                  <Select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    label="Підкатегорія"
                    required
                  >
                    {categoriesData[formData.category].subcategories.map(
                      (subcategory) => (
                        <MenuItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <RegionSelect
              placeHolder="Sélectionner un region"
              onChange={(e) => {
                console.log("🚀 ~ CreateAdPage ~ e):", e);

                setFormData((prev) => ({ ...prev, region: e.name }));
              }}
            />
            <CountrySelect
              placeHolder="Sélectionner un pays"
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
                <Button variant="outlined" component={Link} to="/profile">
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
      </Paper> */}
      <Paper className="form-container">
        <Form method="post" encType="multipart/form-data">
          {actionData?.error && (
            <Typography color="error">{actionData.error}</Typography>
          )}

          <Grid container spacing={3}>
            {/* Title Field */}
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

            {/* Category Select */}
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
                  {Object.entries(categoriesData || {}).map(
                    ([key, { label }]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Subcategory Select (if category is selected) */}
            {formData.category && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Підкатегорія</InputLabel>
                  <Select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    label="Підкатегорія"
                    required
                  >
                    {categories[formData.category]?.subcategories.map(
                      (subcategory) => (
                        <MenuItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Description Field */}
            <Grid size={{ xs: 12 }}>
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

            {/* Price Field */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ціна (якщо є)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Location Field */}
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

            {/* Contact Method Field */}
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

            {/* Image Upload */}
            <Grid size={{ xs: 12 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                multiple
                type="file"
                name="images"
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

            {/* Submit Buttons */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" to="/profile" component={Link}>
                  Скасувати
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={navigation.state === "submitting"}
                  startIcon={<span className="material-icons">send</span>}
                >
                  {navigation.state === "submitting"
                    ? "Публікація..."
                    : "Опублікувати"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </Fragment>
  );
};

CreateAdPage.propTypes = {};
export default CreateAdPage;
