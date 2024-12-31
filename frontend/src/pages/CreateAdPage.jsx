import React, { Fragment, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  GetCountries,
  GetCity,
  GetPhonecodes,
  GetState,
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
import { useDropzone } from "react-dropzone";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { FormRow, FormRowSelect } from "../components";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/categories");
    return data;
  } catch (error) {
    toast.error(
      "Failed to load create ad page data",
      error?.response?.data?.msg
    );
    return error;
  }
};

export const action = async ({ request }) => {
  const formData = new FormData();
  const data = await request.formData();

  // Ajoutez chaque champ au FormData
  formData.append("title", data.get("title"));
  formData.append("categoryId", data.get("categoryId"));
  formData.append("subcategoryId", data.get("subcategoryId"));
  formData.append("country", data.get("country"));
  formData.append("state", data.get("state"));
  formData.append("city", data.get("city"));
  formData.append("description", data.get("description"));
  formData.append("price", data.get("price"));
  formData.append("email", data.get("email"));
  formData.append("phone", data.get("phone"));
  formData.append("location", data.get("location"));

  // Ajoutez les photos
  const photos = data.getAll("photos");
  photos.forEach((photo) => {
    formData.append("photos", photo);
  });
  try {
    const response = await customFetch.post("/adv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("🚀 ~ action ~ response :", response);

    if (response.status === 201) {
      toast.success(response.data.message);
      return redirect("/profile");
    }
  } catch (error) {
    toast.error("Failed to create ad. Please try again.");
    return error;
  }
};

const CreateAdPage = () => {
  const categories = useLoaderData();
  const [selectedCountry, setSelectedCountry] = useState("");
  console.log("🚀 ~ CreateAdPage ~ selectedCountry:", selectedCountry);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [countries, setCountries] = useState([]);
  // console.log("🚀 ~ CreateAdPage ~ countries:", countries);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [phoneCodes, setPhoneCodes] = useState("");
  console.log("🚀 ~ phoneCodes:", phoneCodes);
  const [subcategories, setSubcategories] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
    setSelectedSubCategoryId("");

    // Mettre à jour les sous-catégories disponibles
    const category = categories.find((cat) => cat.id === selectedCategoryId);
    setSubcategories(category ? category.subcategories : []);
  };

  const navigation = useNavigation();
  const actionData = useActionData();

  //   // Update states when selected country changes
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const result = await GetCountries();

        const europeCountries = result.filter(
          (item) => item.region === "Europe"
        );

        setCountries(europeCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) return;
      setLoading(true);
      try {
        const statesList = await GetState(selectedCountry);
        setStates(statesList);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
    setSelectedState("");
    setCities([]);
    setPhoneCodes([]);
  }, [selectedCountry]);

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);

    try {
      const states = await GetState(countryId);
      setStates(states);
    } catch (error) {
      console.error("Error loading states:", error);
    }
  };

  // Fonction de suppression d'une photo
  const handleRemoveImage = (index) => {
    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Callback function when files are dropped
  const onDrop = useCallback((acceptedFiles) => {
    // Process the accepted files
    const imageUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    onDrop,
    multiple: true,
  });

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) return;
      setLoading(true);
      try {
        const citiesList = await GetCity(selectedCountry, selectedState);
        setCities(citiesList);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
    setSelectedCity("");
    setPhoneCodes([]);
  }, [selectedCountry, selectedState]);

  // Fetching phone codes based on selected country, state, and city
  useEffect(() => {
    const fetchPhoneCodes = async () => {
      if (!selectedCountry || !selectedCity || !selectedState) return;

      setLoading(true);
      try {
        const result = await GetPhonecodes();

        const europeCodes = result.filter((item) => item.region === "Europe");
        console.log("🚀 ~ fetchPhoneCodes ~ europeCodes:", europeCodes);

        const countryCode = europeCodes.find(
          (code) => code.name == selectedCountry
        );
        // console.log("🚀 ~ fetchPhoneCodes ~ countryCode:", countryCode);

        // const countryName = countryCode ? countryCode.name : "";

        // console.log("🚀 ~ fetchPhoneCodes ~  countryName:", countryName);
        console.log("🚀 ~ fetchPhoneCodes ~ countryCode:", countryCode);
        if (countryCode) {
          setPhoneCodes(countryCode);
        } else {
          setPhoneCodes("");
        }
      } catch (error) {
        console.error("Error fetching phone codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneCodes();
  }, [selectedCountry, selectedState, selectedCity]);

  return (
    <Fragment>
      <div className="page-header">
        <Typography variant="h4" gutterBottom>
          Створити нове оголошення
        </Typography>
      </div>

      <Paper className="form-container">
        <Form method="post" encType="multipart/form-data">
          {actionData?.error && (
            <Typography color="error">{actionData.error}</Typography>
          )}

          <Grid container spacing={3}>
            {/* Title Field */}
            <Grid size={{ xs: 12 }}>
              <FormRow type="text" name="title" label="Заголовок оголошення" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="categoryId"
                  label="Catégorie"
                  required
                  value={selectedCategoryId || ""}
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">
                    <em>Sélectionner une catégorie</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedCategoryId && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Sous-catégorie</InputLabel>
                  <Select
                    name="subcategoryId"
                    label="Sous-catégorie"
                    required
                    value={selectedSubCategoryId || ""}
                    onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Sélectionner une sous-catégorie</em>
                    </MenuItem>
                    {categories
                      .find((cat) => cat.id === selectedCategoryId)
                      ?.SubCategories.map((sub) => (
                        <MenuItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </MenuItem>
                      ))}
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
                required
              />
            </Grid>
            {/* Price Field */}

            {/* Country Field */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>{" "}
                <Select
                  // name="country"
                  label="Country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  required
                >
                  {countries.map((country, index) => {
                    {
                      /* console.log("🚀 ~ {countries.map ~ index:", index);
                    console.log("🚀 ~ {countries.map ~ country:", country); */
                    }
                    return (
                      <MenuItem key={country.id} value={country.name}>
                        {country.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            {/* State Field */}
            {selectedCountry && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>{" "}
                  <Select
                    name="state"
                    label="State"
                    required
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.id} value={state.id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {selectedState && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    label="City"
                    name="city"
                    disabled={cities.length === 0}
                  >
                    {cities.map((city) => {
                      return (
                        <MenuItem key={city.id} value={city.id}>
                          {city.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {/* Location Field */}
            <Grid size={{ xs: 12 }}>
              <FormRow type="text" label="Місто" name="location" />
            </Grid>
            {/* Contact Method Field */}

            <Grid size={{ xs: 12 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    label="Код країни"
                    value={phoneCodes.phone_code || ""}
                  />
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    label="Контактний телефон"
                    name="phone"
                    type="text"
                    // value={formData.contactMethod}
                    // onChange={handleInputChange}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <FormRow
                type="email"
                label="Вкажіть email"
                name="email"
                // defaultValue="Вкажіть телефон, email або інший спосіб зв'язку"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <FormRow label="Ціна (якщо є)" name="price" type="number" />
            </Grid>
            {/* Image Upload */}
            <Grid size={{ xs: 12 }}>
              <div {...getRootProps()} className="image-upload-container">
                <input {...getInputProps({ name: "photos" })} />
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
              {previewImages.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
                  {previewImages.map((url, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        marginRight: 10,
                        marginBottom: 10,
                      }}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="preview-image"
                        style={{ width: 100, height: 100, marginRight: 10 }}
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          padding: "5px",
                          cursor: "pointer",
                        }}
                      >
                        X
                      </button>
                    </div>
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
          {loading && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}
        </Form>
      </Paper>
    </Fragment>
  );
};

CreateAdPage.propTypes = {};
export default CreateAdPage;
