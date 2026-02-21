import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
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
import Grid from "@mui/material/Grid";
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
import { FormRow } from "../components";

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

  // Append each field to FormData
  for (const [key, value] of data.entries()) {
    if (key !== "photos") {
      formData.append(key, value);
    }
  }

  // Append photos
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

    if (response.status === 201) {
      toast.success(response.data.message);
      return redirect("/profile");
    }
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Failed to create ad.");
    return error;
  }
};

const CreateAdPage = () => {
  const categories = useLoaderData();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
    setSelectedSubCategoryId("");
  };

  const navigation = useNavigation();
  const actionData = useActionData();

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
        toast.error("Failed to load countries");
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
        const countryObj = countries.find((c) => c.name === selectedCountry);
        if (countryObj) {
          const statesList = await GetState(countryObj.id);
          setStates(statesList);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Failed to load states");
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
    setSelectedState("");
    setCities([]);
  }, [selectedCountry, countries]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry || !selectedState) return;
      setLoading(true);
      try {
        const countryObj = countries.find((c) => c.name === selectedCountry);
        const stateObj = states.find((s) => s.name === selectedState);
        if (countryObj && stateObj) {
          const citiesList = await GetCity(countryObj.id, stateObj.id);
          setCities(citiesList);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to load cities");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
    setSelectedCity("");
  }, [selectedCountry, selectedState, countries, states]);

  useEffect(() => {
    const fetchPhoneCode = async () => {
      if (!selectedCountry) return;
      try {
        const countryObj = countries.find((c) => c.name === selectedCountry);
        if (countryObj) {
          const phoneCode = await GetPhonecodes(countryObj.id);
          if (phoneCode) {
            setPhoneCode(phoneCode);
          }
        }
      } catch (error) {
        console.error("Error fetching phone code:", error);
      }
    };
    fetchPhoneCode();
  }, [selectedCountry, countries]);

  const handleRemoveImage = useCallback((index) => {
    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    // Validate file sizes (limit to 5MB per file)
    const maxSize = 5 * 1024 * 1024;
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => {
        const newImages = [...prev, ...imageUrls];
        // Limit to maximum 5 images
        if (newImages.length > 5) {
          toast.warning("Maximum 5 images allowed");
          return newImages.slice(0, 5);
        }
        return newImages;
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    onDrop,
    multiple: true,
    maxFiles: 5,
  });

  // Fixed variable name - use consistent naming
  const subcategories = useMemo(() => {
    if (!Array.isArray(categories) || !selectedCategoryId) {
      return [];
    }

    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );
    return selectedCategory?.SubCategories || [];
  }, [categories, selectedCategoryId]);

  const isFormValid = useMemo(() => {
    return (
      selectedCategoryId &&
      selectedSubCategoryId &&
      selectedCountry &&
      selectedState &&
      selectedCity
    );
  }, [
    selectedCategoryId,
    selectedSubCategoryId,
    selectedCountry,
    selectedState,
    selectedCity,
  ]);

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
            <Typography color="error" sx={{ mb: 2 }}>
              {actionData.error}
            </Typography>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <FormRow
                type="text"
                name="title"
                label="Заголовок оголошення"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="categoryId"
                  label="Catégorie"
                  required
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  error={
                    !selectedCategoryId && navigation.state === "submitting"
                  }
                >
                  <MenuItem value="">
                    <em>Sélectionner une catégorie</em>
                  </MenuItem>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <em>Aucune catégorie disponible</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {selectedCategoryId && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Sous-catégorie</InputLabel>
                  <Select
                    name="subcategoryId"
                    label="Sous-catégorie"
                    required
                    value={selectedSubCategoryId}
                    onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                    error={
                      !selectedSubCategoryId &&
                      navigation.state === "submitting"
                    }
                  >
                    <MenuItem value="">
                      <em>Sélectionner une sous-catégorie</em>
                    </MenuItem>
                    {subcategories.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Опис"
                name="description"
                required
                inputProps={{
                  minLength: 10,
                  maxLength: 5000,
                }}
                helperText="Мінімум 10 символів, максимум 5000"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth required>
                <InputLabel>Country</InputLabel>
                <Select
                  name="country"
                  label="Country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  required
                  error={!selectedCountry && navigation.state === "submitting"}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedCountry && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth required>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    label="State"
                    required
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    error={!selectedState && navigation.state === "submitting"}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.id} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {selectedState && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth required>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    label="City"
                    name="city"
                    required
                    disabled={cities.length === 0}
                    error={!selectedCity && navigation.state === "submitting"}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <FormRow type="text" label="Місто" name="location" required />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    label="Код країни"
                    value={phoneCode}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    label="Контактний телефон"
                    name="phone"
                    type="tel"
                    required
                    inputProps={{
                      pattern: "[0-9]{3}[0-9]{3}[0-9]{4,6}",
                    }}
                    helperText="Формат: 0123456789"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 8 }}>
              <FormRow
                type="email"
                label="Вкажіть email"
                name="email"
                required
              />
            </Grid>

            <Grid size={{ xs: 4 }}>
              <FormRow
                label="Ціна (якщо є)"
                name="price"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isDragActive ? "#f5f5f5" : "transparent",
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                  },
                }}
              >
                <input {...getInputProps({ name: "photos" })} />
                <span
                  className="material-icons"
                  style={{ fontSize: 48, color: "#666" }}
                >
                  add_photo_alternate
                </span>
                <Typography variant="body1" gutterBottom>
                  {isDragActive
                    ? "Відпустіть файли тут..."
                    : "Додати фотографії"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Клікніть або перетягніть файли сюди (максимум 5 файлів, до 5MB
                  кожен)
                </Typography>
              </Box>

              {previewImages.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {previewImages.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        border: "1px solid #ddd",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          minWidth: 24,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.9)",
                          },
                        }}
                      >
                        ×
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/profile"
                  disabled={navigation.state === "submitting"}
                >
                  Скасувати
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={navigation.state === "submitting" || !isFormValid}
                  startIcon={
                    navigation.state === "submitting" ? (
                      <CircularProgress size={16} />
                    ) : (
                      <span className="material-icons">send</span>
                    )
                  }
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

export default CreateAdPage;
