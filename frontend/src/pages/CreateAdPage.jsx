import React, { Fragment, useEffect, useState } from "react";
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
  const formData = await request.formData();

  const adData = {
    title: formData.get("title"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    country: formData.get("country"),
    state: formData.get("state"),
    city: formData.get("city"),
    description: formData.get("description"),
    price: formData.get("price") ? Number(formData.get("price")) : null,
    location: formData.get("location"),
    email: formData.get("email"),
    photos: formData.getAll("photos"),
  };

  try {
    const response = await customFetch.post("/adv", adData);
    console.log("🚀 ~ action ~ response :", response);

    if (!response.ok) {
      throw new Error("Failed to create ad");
    }

    toast.success("Ви увійшли успішно успішно");
    return redirect("/profile");
  } catch (error) {
    toast.error("Failed to create ad. Please try again.");
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
  const [phoneCodes, setPhoneCodes] = useState("");

  const [loading, setLoading] = useState(false);
  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };

  const [previewImages, setPreviewImages] = useState([]);

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

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
        const countryCode = europeCodes.find(
          (code) => code.id === selectedCountry
        );

        if (countryCode) {
          setPhoneCodes(countryCode.phone_code);
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
                  name="name"
                  label="Catégorie"
                  required
                  value={selectedCategoryId || ""}
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">
                    <em>None</em>
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
                    name="name"
                    label="Sous-catégorie"
                    required
                    value={selectedSubCategoryId || ""}
                    onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
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
                  name="country"
                  label="Country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  required
                >
                  {countries.map((country) => {
                    return (
                      <MenuItem key={country.id} value={country.id}>
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
                    value={phoneCodes || ""}
                  />
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    label="Контактний телефон"
                    name="contact"
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
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                multiple
                type="file"
                name="photos"
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

// import React, { Fragment, useState, useCallback, useEffect } from "react";
// import PropTypes from "prop-types";
// import {
//   Button,
//   Typography,
//   TextField,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Box,
//   Paper,
//   FormHelperText,
// } from "@mui/material";
// import Grid from "@mui/material/Grid2";
// import {
//   GetCountries,
//   GetState,
//   GetCity,
//   GetLanguages,
//   GetRegions,
//   GetPhonecodes,
// } from "react-country-state-city";
// import "react-country-state-city/dist/react-country-state-city.css";
// import {
//   Form,
//   useLoaderData,
//   useNavigation,
//   useActionData,
//   redirect,
//   Link,
// } from "react-router-dom";
// import { toast } from "react-toastify";
// import customFetch from "../utils/customFetch";
// import { FormRow, FormRowSelect } from "../components";
// import "../assets/css/create-ad.css";
// import "react-country-state-city/dist/react-country-state-city.css";

// // europeanCountries.js
// export const europeanCountries = [
//   "AT", // Austria
//   "BE", // Belgium
//   "BG", // Bulgaria
//   "HR", // Croatia
//   "CY", // Cyprus
//   "CZ", // Czech Republic
//   "DK", // Denmark
//   "EE", // Estonia
//   "FI", // Finland
//   "FR", // France
//   "DE", // Germany
//   "GR", // Greece
//   "HU", // Hungary
//   "IE", // Ireland
//   "IT", // Italy
//   "LV", // Latvia
//   "LT", // Lithuania
//   "LU", // Luxembourg
//   "MT", // Malta
//   "NL", // Netherlands
//   "PL", // Poland
//   "PT", // Portugal
//   "RO", // Romania
//   "SK", // Slovakia
//   "SI", // Slovenia
//   "ES", // Spain
//   "SE", // Sweden
// ];

// // Improved Loader Function with Error Handling
// export const loader = async () => {
//   try {
//     const { data } = await customFetch.get("/categories");
//     return data || [];
//   } catch (error) {
//     toast.error("Failed to load categories");
//     return [];
//   }
// };

// // Enhanced Action Function with Validation
// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const adData = Object.fromEntries(formData);

//   // Basic Validation
//   const errors = {};
//   if (!adData.title?.trim()) errors.title = "Title is required";
//   if (!adData.category) errors.category = "Category is required";
//   if (!adData.description?.trim())
//     errors.description = "Description is required";

//   if (Object.keys(errors).length) {
//     return { errors };
//   }

//   try {
//     const response = await customFetch.post("/adv", {
//       ...adData,
//       price: adData.price ? Number(adData.price) : null,
//       photos: formData.getAll("photos"),
//     });

//     toast.success("Ad created successfully");
//     return redirect("/profile");
//   } catch (error) {
//     toast.error(error.response?.data?.msg || "Failed to create ad");
//     return error;
//   }
// };

// const CreateAdPage = () => {
//   const categories = useLoaderData() || [];
//   const navigation = useNavigation();
//   const actionData = useActionData();

//   const [formData, setFormData] = React.useState({
//     category: "",
//     title: "",
//     description: "",
//     price: "",
//     country: "",
//     state: "",
//     city: "",
//     location: "",
//     contactMethod: "",
//     phoneCode: "",
//     language: "",
//     images: [],
//   });

//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   // const [selectedCountry, setSelectedCountry] = useState("");
//   // const [countriesList, setCountriesList] = useState([]);
//   // const [statesList, setStatesList] = useState([]);
//   // const [previewImages, setPreviewImages] = useState([]);

//   const [countries, setCountries] = React.useState([]);
//   const [states, setStates] = React.useState([]);
//   const [cities, setCities] = React.useState([]);
//   const [languages, setLanguages] = React.useState([]);
//   const [phoneCodes, setPhoneCodes] = React.useState([]);
//   const [previewImages, setPreviewImages] = React.useState([]);
//   const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
//   const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
//   const [showErrorDialog, setShowErrorDialog] = React.useState(false);
//   const [errorMessage, setErrorMessage] = React.useState("");
//   const [countryId, setCountryId] = React.useState(0);
//   const [stateId, setStateId] = React.useState(0);
//   const [cityId, setCityId] = React.useState(0);
//   const [regionsList, setRegionsList] = React.useState([]);

//   // Update states when selected country changes
//   React.useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [countriesData, languagesData, phoneCodesData, regionsData] =
//           await Promise.all([
//             GetCountries(),
//             GetLanguages(),
//             GetPhonecodes(),
//             GetRegions(),
//           ]);

//         const europeanCountries = countriesData.filter((country) => {
//           return country.region === "Europe";
//         });
//         setCountries(europeanCountries);
//         setLanguages(languagesData);
//         setPhoneCodes(phoneCodesData);
//         setRegionsList(regionsData);
//       } catch (error) {
//         console.error("Error loading initial data:", error);
//         setErrorMessage("Failed to load initial data. Please try again.");
//         setShowErrorDialog(true);
//       }
//     };

//     loadData();
//   }, []);

//   const handleCategoryChange = (event) => {
//     setSelectedCategoryId(event.target.value);
//   };

//   const handleCountryChange = async (e) => {
//     console.log("🚀 ~ handleCountryChange ~ e.target:", e);

//     const countryId = e.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       country: countryId,
//       state: "",
//       city: "",
//     }));
//     setCountryId(countryId);

//     try {
//       const states = await GetState(countryId);
//       setStates(states);
//     } catch (error) {
//       console.error("Error loading states:", error);
//     }
//   };

//   const handleStateChange = async (e) => {
//     const stateId = e.target.value;
//     console.log("🚀 ~ handleStateChange ~ stateId:", stateId);
//     setFormData((prev) => ({
//       ...prev,
//       state: stateId,
//       city: "",
//     }));
//     setStateId(stateId);

//     try {
//       const cities = await GetCity(countryId, stateId);
//       console.log("🚀 ~ handleStateChange ~ cities:", cities);
//       setCities(cities);
//     } catch (error) {
//       console.error("Error loading cities:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageUpload = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     const imageUrls = files.map((file) => URL.createObjectURL(file));
//     setPreviewImages((prev) => [...prev, ...imageUrls]);
//   }, []);

//   const removePreviewImage = useCallback((indexToRemove) => {
//     setPreviewImages((prev) =>
//       prev.filter((_, index) => index !== indexToRemove)
//     );
//   }, []);

//   return (
//     <Fragment>
//       <Typography variant="h4" gutterBottom>
//         Створити нове оголошення
//       </Typography>

//       <Paper sx={{ p: 3, mt: 2 }}>
//         <Form method="post" encType="multipart/form-data">
//           {actionData?.errors && (
//             <Box sx={{ mb: 2, color: "error.main" }}>
//               {Object.entries(actionData.errors).map(([key, value]) => (
//                 <Typography key={key} variant="body2">
//                   {value}
//                 </Typography>
//               ))}
//             </Box>
//           )}

//           <Grid container spacing={3}>
//             {/* Title Field */}
//             <Grid xs={12}>
//               <FormRow
//                 type="text"
//                 name="title"
//                 label="Заголовок оголошення"
//                 error={actionData?.errors?.title}
//               />
//             </Grid>

//             {/* Category Selection */}
//             <Grid xs={12}>
//               <FormControl fullWidth error={!!actionData?.errors?.category}>
//                 <InputLabel>Категорія</InputLabel>
//                 <Select
//                   name="category"
//                   value={selectedCategoryId || ""}
//                   onChange={handleCategoryChange}
//                   label="Категорія"
//                 >
//                   {categories.map((cat) => (
//                     <MenuItem key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {actionData?.errors?.category && (
//                   <FormHelperText>{actionData.errors.category}</FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>

//             {/* Subcategory Selection */}
//             {selectedCategoryId && (
//               <Grid xs={12}>
//                 <FormControl fullWidth>
//                   <InputLabel>Підкатегорія</InputLabel>
//                   <Select name="subcategory" label="Підкатегорія">
//                     {categories
//                       .find((cat) => cat.id === selectedCategoryId)
//                       ?.SubCategories?.map((sub) => (
//                         <MenuItem key={sub.id} value={sub.id}>
//                           {sub.name}
//                         </MenuItem>
//                       ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             )}

//             {/* Description Field */}
//             <Grid xs={12}>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={4}
//                 name="description"
//                 label="Опис"
//                 error={!!actionData?.errors?.description}
//                 helperText={actionData?.errors?.description}
//               />
//             </Grid>

//             {/* Price Field */}
//             <Grid xs={12} sm={6}>
//               <FormRow label="Ціна (якщо є)" name="price" type="number" />
//             </Grid>

//             {/* Country Selection */}
//              <Grid xs={12} sm={6}>
//               <FormRowSelect
//                 name="country"
//                 labelText="Країна"
//                 defaultValue={selectedCountry}
//                 list={countriesList}
//               />
//             </Grid>

//             {/* State Selection */}
//              {selectedCountry && (
//               <Grid xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Область/Регіон</InputLabel>
//                   <Select name="state">
//                     {statesList.map((state) => {
//                       console.log("🚀 ~ {statesList.map ~ state:", state);

//                       return (
//                         <MenuItem key={state.isoCode} value={state.isoCode}>
//                           {state.name}
//                         </MenuItem>
//                       );
//                     })}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             )}

//             {/* Location and Contact Fields */}
//              <Grid xs={12} sm={6}>
//               <FormRow type="text" label="Місто" name="location" />
//             </Grid>
//             <Grid xs={12} sm={6}>
//               <FormRow
//                 type="email"
//                 label="Email для зв'язку"
//                 name="contactMethod"
//               />
//             </Grid>
//             <Grid xs={12} sm={6}>
//               <FormRow type="tel" label="Телефон" name="phone" />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Країна</InputLabel>
//                 <Select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleCountryChange}
//                   label="Країна"
//                   required
//                 >
//                   {countries.map((country) => (
//                     <MenuItem key={country.id} value={country.id}>
//                       {country.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Регіон/Область</InputLabel>
//                 <Select
//                   name="state"
//                   value={formData.state}
//                   onChange={handleStateChange}
//                   label="Регіон/Область"
//                   required
//                   disabled={!formData.country}
//                 >
//                   {states.map((state) => (
//                     <MenuItem key={state.id} value={state.id}>
//                       {state.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Місто</InputLabel>
//                 <Select
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   label="Місто"
//                   required
//                   disabled={!formData.state}
//                 >
//                   {cities.map((city) => (
//                     <MenuItem key={city.id} value={city.id}>
//                       {city.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <Grid container spacing={2}>
//                 <Grid item xs={4}>
//                   <FormControl fullWidth>
//                     <InputLabel>Код країни</InputLabel>
//                     <Select
//                       name="phoneCode"
//                       value={formData.phoneCode}
//                       onChange={handleInputChange}
//                       label="Код країни"
//                     >
//                       {phoneCodes.map((code) => (
//                         <MenuItem key={code.id} value={code.code}>
//                           {code.code}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={8}>
//                   <TextField
//                     fullWidth
//                     label="Контактний телефон"
//                     name="contactMethod"
//                     value={formData.contactMethod}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </Grid>
//               </Grid>
//             </Grid>

//             {/* Image Upload */}
//             <Grid xs={12}>
//               <input
//                 accept="image/*"
//                 style={{ display: "none" }}
//                 id="image-upload"
//                 multiple
//                 type="file"
//                 name="photos"
//                 onChange={handleImageUpload}
//               />
//               <label htmlFor="image-upload">
//                 <Box
//                   sx={{
//                     border: "2px dashed grey",
//                     borderRadius: 2,
//                     p: 3,
//                     textAlign: "center",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <Typography variant="h6">Додати фотографії</Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     Клікніть або перетягніть файли
//                   </Typography>
//                 </Box>
//               </label>

//               {previewImages.length > 0 && (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: 2,
//                     mt: 2,
//                   }}
//                 >
//                   {previewImages.map((url, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         position: "relative",
//                         width: 100,
//                         height: 100,
//                       }}
//                     >
//                       <img
//                         src={url}
//                         alt={`Preview ${index + 1}`}
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                         }}
//                       />
//                       <Button
//                         size="small"
//                         color="error"
//                         sx={{
//                           position: "absolute",
//                           top: 0,
//                           right: 0,
//                         }}
//                         onClick={() => removePreviewImage(index)}
//                       >
//                         X
//                       </Button>
//                     </Box>
//                   ))}
//                 </Box>
//               )}
//             </Grid>

//             {/* Action Buttons */}
//             <Grid xs={12}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   gap: 2,
//                 }}
//               >
//                 <Button variant="outlined" component={Link} to="/profile">
//                   Скасувати
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   type="submit"
//                   disabled={navigation.state === "submitting"}
//                 >
//                   {navigation.state === "submitting"
//                     ? "Публікація..."
//                     : "Опублікувати"}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </Form>
//       </Paper>
//     </Fragment>
//   );
// };

// CreateAdPage.propTypes = {};
// export default CreateAdPage;
