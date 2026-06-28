// import { useEffect, useState, useCallback, useMemo } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Grid,
//   Divider,
//   CircularProgress,
//   Chip,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   LinearProgress,
//   Alert,
//   InputAdornment,
// } from "@mui/material";
// import {
//   useLoaderData,
//   Form,
//   redirect,
//   Link,
//   useNavigation,
//   useActionData,
// } from "react-router-dom";
// import { useDropzone } from "react-dropzone";
// import { GetCountries, GetCity, GetState } from "react-country-state-city";
// import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
// import CloseIcon from "@mui/icons-material/Close";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import EuroIcon from "@mui/icons-material/Euro";
// import IconButton from "@mui/material/IconButton";
// import customFetch, { apiUrl } from "../../utils/customFetch";
// import { toast } from "react-toastify";

// /* ── Loader / Action ── */
// export const loader = async ({ params }) => {
//   try {
//     const [{ data: ad }, { data: categories }] = await Promise.all([
//       customFetch.get(`/adv/${params.id}`),
//       customFetch.get("/categories"),
//     ]);
//     return { ad, categories };
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.message || "Помилка завантаження оголошення",
//     );
//     return { ad: {}, categories: [] };
//   }
// };

// export const action = async ({ request, params }) => {
//   const raw = await request.formData();

//   // Separate removed photos from the rest
//   const removedPhotos = raw.getAll("removedPhotos");
//   const newPhotos = raw.getAll("photos");

//   const formData = new FormData();
//   for (const [key, value] of raw.entries()) {
//     if (key !== "photos" && key !== "removedPhotos") {
//       formData.append(key, value);
//     }
//   }
//   removedPhotos.forEach((p) => formData.append("removedPhotos", p));
//   newPhotos.forEach((p) => formData.append("photos", p));

//   try {
//     await customFetch.put(`/adv/${params.id}`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     toast.success("Оголошення оновлено успішно");
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Помилка оновлення");
//     return { error: error?.response?.data?.message };
//   }

//   const referer = request.headers.get("Referer") || "";
//   return redirect("/profile");
// };

// /* ── Design tokens ── */
// const F_BODY = "'Plus Jakarta Sans', sans-serif";
// const F_DISPLAY = "'Playfair Display', serif";
// const BLUE = "#0057B8";
// const GOLD = "#FFD700";

// const inputSx = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "12px",
//     fontFamily: F_BODY,
//     bgcolor: "#f8fafc",
//     "& fieldset": { borderColor: "#e2e8f0" },
//     "&:hover fieldset": { borderColor: BLUE },
//     "&.Mui-focused fieldset": { borderColor: BLUE, borderWidth: "1.5px" },
//   },
//   "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
//   "& .MuiInputLabel-root": { fontFamily: F_BODY },
//   "& .MuiFormHelperText-root": { fontFamily: F_BODY, fontSize: "0.75rem" },
// };

// const selectSx = {
//   borderRadius: "12px",
//   fontFamily: F_BODY,
//   bgcolor: "#f8fafc",
//   "& fieldset": { borderColor: "#e2e8f0" },
//   "&:hover fieldset": { borderColor: BLUE },
//   "&.Mui-focused fieldset": { borderColor: BLUE },
// };

// /* ── Section wrapper ── */
// function EditSection({ icon, title, children }) {
//   return (
//     <Box sx={{ mb: 0 }}>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
//         <Box
//           sx={{
//             width: 4,
//             height: 24,
//             borderRadius: "99px",
//             background: `linear-gradient(180deg, ${BLUE}, ${GOLD})`,
//           }}
//         />
//         <Box
//           sx={{
//             width: 36,
//             height: 36,
//             borderRadius: "10px",
//             bgcolor: "#eff6ff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexShrink: 0,
//           }}
//         >
//           <span
//             className="material-icons"
//             style={{ fontSize: 18, color: BLUE }}
//           >
//             {icon}
//           </span>
//         </Box>
//         <Typography
//           sx={{
//             fontFamily: F_BODY,
//             fontWeight: 700,
//             fontSize: "0.95rem",
//             color: "#0f172a",
//           }}
//         >
//           {title}
//         </Typography>
//       </Box>
//       {children}
//     </Box>
//   );
// }

// /* ── Main Component ── */
// export default function EditAdPage() {
//   const { ad, categories } = useLoaderData();
//   console.log("🚀 ~ EditAdPage ~  ad:", ad);

//   const navigation = useNavigation();
//   const actionData = useActionData();
//   const isSubmitting = navigation.state === "submitting";

//   const isProfile =
//     typeof window !== "undefined" &&
//     window.location.pathname.includes("/profile/");
//   const cancelHref = isProfile ? "/profile" : "/dashboard/ads";

//   /* ── Category state ── */
//   const [selectedCategoryId, setSelectedCategoryId] = useState(
//     ad.categoryId || "",
//   );
//   const [selectedSubCatId, setSelectedSubCatId] = useState(
//     ad.subcategoryId || "",
//   );

//   const subcategories = useMemo(() => {
//     if (!Array.isArray(categories) || !selectedCategoryId) return [];
//     return (
//       categories.find((c) => c.id === selectedCategoryId)?.SubCategories || []
//     );
//   }, [categories, selectedCategoryId]);

//   /* ── Location state ── */
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(ad.country || "");
//   const [selectedState, setSelectedState] = useState(ad.state || "");
//   const [selectedCity, setSelectedCity] = useState(ad.city || "");
//   const [phoneCode, setPhoneCode] = useState("");
//   const [locationLoading, setLocationLoading] = useState(false);

//   /* Load European countries */
//   useEffect(() => {
//     setLocationLoading(true);
//     GetCountries()
//       .then((all) => setCountries(all.filter((c) => c.region === "Europe")))
//       .catch(() => toast.error("Помилка завантаження країн"))
//       .finally(() => setLocationLoading(false));
//   }, []);

//   /* Pre-load states for the existing country */
//   useEffect(() => {
//     if (!selectedCountry || countries.length === 0) return;
//     const countryObj = countries.find((c) => c.name === selectedCountry);
//     if (!countryObj) return;
//     setLocationLoading(true);
//     GetState(countryObj.id)
//       .then((list) => {
//         setStates(list);
//         if (countryObj.phone_code) setPhoneCode(countryObj.phone_code);

//         // Fix for out-of-range warning: if current selectedState doesn't exist in the new list,
//         // try to find a partial match (e.g., "Mazovian" -> "Masovian Voivodeship")
//         if (selectedState && list.length > 0) {
//           const exists = list.some((s) => s.name === selectedState);
//           if (!exists) {
//             const match = list.find(
//               (s) =>
//                 s.name.toLowerCase().includes(selectedState.toLowerCase()) ||
//                 selectedState.toLowerCase().includes(s.name.toLowerCase()),
//             );
//             if (match) {
//               setSelectedState(match.name);
//             }
//           }
//         }
//       })
//       .catch(() => toast.error("Помилка завантаження регіонів"))
//       .finally(() => setLocationLoading(false));
//   }, [selectedCountry, countries]);

//   /* Pre-load cities for the existing state */
//   useEffect(() => {
//     if (
//       !selectedCountry ||
//       !selectedState ||
//       countries.length === 0 ||
//       states.length === 0
//     )
//       return;
//     const countryObj = countries.find((c) => c.name === selectedCountry);
//     const stateObj = states.find((s) => s.name === selectedState);
//     if (!countryObj || !stateObj) return;
//     setLocationLoading(true);
//     GetCity(countryObj.id, stateObj.id)
//       .then((list) => setCities(list))
//       .catch(() => toast.error("Помилка завантаження міст"))
//       .finally(() => setLocationLoading(false));
//   }, [selectedState, selectedCountry, countries, states]);

//   const handleCountryChange = (e) => {
//     setSelectedCountry(e.target.value);
//     setSelectedState("");
//     setCities([]);
//     setSelectedCity("");
//   };

//   const handleStateChange = (e) => {
//     setSelectedState(e.target.value);
//     setSelectedCity("");
//   };

//   /* ── Photo state ── */
//   // Existing photos from backend (URLs/paths)
//   const [existingPhotos, setExistingPhotos] = useState(ad.photos || []);
//   console.log("🚀 ~ EditAdPage ~ existingPhotos:", existingPhotos);

//   // Track which existing photos to remove
//   const [removedPhotos, setRemovedPhotos] = useState([]);
//   console.log("🚀 ~ EditAdPage ~ removedPhotos:", removedPhotos);
//   // New photos added by user
//   const [newPhotos, setNewPhotos] = useState([]);
//   console.log("🚀 ~ EditAdPage ~ newPhotos:", newPhotos);

//   const totalPhotos = existingPhotos.length + newPhotos.length;
//   console.log("🚀 ~ EditAdPage ~ totalPhotos :", totalPhotos);

//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       const maxSize = 5 * 1024 * 1024;
//       const valid = acceptedFiles.filter((f) => {
//         if (f.size > maxSize) {
//           toast.error(`${f.name} > 5MB`);
//           return false;
//         }
//         return true;
//       });
//       if (!valid.length) return;
//       setNewPhotos((prev) => {
//         const next = [
//           ...prev,
//           ...valid.map((f) => ({ url: URL.createObjectURL(f), file: f })),
//         ];
//         if (existingPhotos.length + next.length > 5) {
//           toast.warning("Максимум 5 фото");
//           return next.slice(0, 5 - existingPhotos.length);
//         }
//         return next;
//       });
//     },
//     [existingPhotos.length],
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
//     onDrop,
//     multiple: true,
//     maxFiles: 5,
//   });

//   const removeExistingPhoto = (path) => {
//     setRemovedPhotos((prev) => [...prev, path]);
//     setExistingPhotos((prev) => prev.filter((p) => p !== path));
//   };

//   const removeNewPhoto = (i) => {
//     setNewPhotos((prev) => prev.filter((_, idx) => idx !== i));
//   };

//   if (!ad?.title) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "60vh",
//         }}
//       >
//         <Box sx={{ textAlign: "center" }}>
//           <Typography
//             sx={{
//               fontFamily: F_DISPLAY,
//               fontSize: "1.4rem",
//               color: "#94a3b8",
//               mb: 2,
//             }}
//           >
//             Оголошення не знайдено
//           </Typography>
//           <Button
//             component={Link}
//             to={cancelHref}
//             sx={{
//               fontFamily: F_BODY,
//               fontWeight: 600,
//               textTransform: "none",
//               color: BLUE,
//             }}
//           >
//             ← Назад
//           </Button>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
//       {/* ── Header ── */}
//       <Box
//         sx={{
//           background:
//             "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
//           py: { xs: 5, md: 7 },
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             inset: 0,
//             backgroundImage:
//               "radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)",
//             backgroundSize: "28px 28px",
//             pointerEvents: "none",
//           }}
//         />
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             height: 4,
//             background:
//               "linear-gradient(90deg, transparent, #FFD700 30%, #FFD700 70%, transparent)",
//             opacity: 0.7,
//           }}
//         />
//         <Box
//           sx={{
//             maxWidth: 960,
//             mx: "auto",
//             px: { xs: 2, md: 4 },
//             position: "relative",
//           }}
//         >
//           <Button
//             component={Link}
//             to={cancelHref}
//             startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
//             sx={{
//               fontFamily: F_BODY,
//               fontWeight: 600,
//               textTransform: "none",
//               color: "rgba(255,255,255,.7)",
//               mb: 3,
//               p: 0,
//               "&:hover": { color: "#fff", bgcolor: "transparent" },
//             }}
//           >
//             {isProfile ? "Назад до профілю" : "Назад до оголошень"}
//           </Button>

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 2,
//               flexWrap: "wrap",
//             }}
//           >
//             <Box sx={{ flexGrow: 1 }}>
//               <Typography
//                 sx={{
//                   fontFamily: F_DISPLAY,
//                   fontWeight: 700,
//                   fontSize: { xs: "1.6rem", md: "2rem" },
//                   color: "#fff",
//                   letterSpacing: "-0.02em",
//                   mb: 0.5,
//                 }}
//               >
//                 Редагувати оголошення
//               </Typography>
//               <Typography
//                 sx={{
//                   fontFamily: F_BODY,
//                   fontSize: "0.875rem",
//                   color: "rgba(255,255,255,.6)",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   whiteSpace: "nowrap",
//                   maxWidth: 500,
//                 }}
//               >
//                 {ad.title}
//               </Typography>
//             </Box>
//             <Chip
//               label={`ID: ${ad.id}`}
//               sx={{
//                 fontFamily: F_BODY,
//                 fontWeight: 700,
//                 fontSize: "0.72rem",
//                 bgcolor: "rgba(255,255,255,.12)",
//                 color: "rgba(255,255,255,.7)",
//                 border: "1px solid rgba(255,255,255,.2)",
//                 alignSelf: "flex-start",
//                 mt: 0.5,
//               }}
//             />
//           </Box>
//         </Box>
//       </Box>

//       {/* ── Form ── */}
//       <Box
//         sx={{
//           maxWidth: 860,
//           mx: "auto",
//           px: { xs: 2, md: 4 },
//           py: { xs: 4, md: 6 },
//         }}
//       >
//         <Form method="post" encType="multipart/form-data">
//           {/* Hidden fields for removed photos */}
//           {removedPhotos.map((path) => (
//             <input key={path} type="hidden" name="removedPhotos" value={path} />
//           ))}
//           {/* Hidden fields for new photo files */}
//           {newPhotos.map(({ file }, i) => {
//             // We use a ref-based approach via a hidden input rendered by dropzone
//             // The actual files are submitted via the dropzone input below
//             return null;
//           })}

//           <Paper
//             elevation={0}
//             sx={{
//               borderRadius: "20px",
//               border: "1.5px solid #e2e8f0",
//               p: { xs: 3, md: 5 },
//               boxShadow: "0 4px 24px rgba(0,87,184,.06)",
//             }}
//           >
//             {actionData?.error && (
//               <Alert
//                 severity="error"
//                 sx={{ borderRadius: "12px", fontFamily: F_BODY, mb: 3 }}
//               >
//                 {actionData.error}
//               </Alert>
//             )}

//             {/* ── Section 1: Basic info + Category ── */}
//             <EditSection icon="edit_note" title="Основна інформація">
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
//                 <TextField
//                   name="title"
//                   label="Заголовок"
//                   required
//                   fullWidth
//                   defaultValue={ad.title}
//                   sx={inputSx}
//                 />

//                 <Grid container spacing={2}>
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <FormControl fullWidth required>
//                       <InputLabel sx={{ fontFamily: F_BODY }}>
//                         Категорія
//                       </InputLabel>
//                       <Select
//                         name="categoryId"
//                         label="Категорія"
//                         value={selectedCategoryId}
//                         onChange={(e) => {
//                           setSelectedCategoryId(e.target.value);
//                           setSelectedSubCatId("");
//                         }}
//                         sx={selectSx}
//                       >
//                         <MenuItem
//                           value=""
//                           sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
//                         >
//                           <em>Виберіть категорію</em>
//                         </MenuItem>
//                         {Array.isArray(categories) &&
//                           categories.map((cat) => (
//                             <MenuItem
//                               key={cat.id}
//                               value={cat.id}
//                               sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
//                             >
//                               {cat.name}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>

//                   {selectedCategoryId && (
//                     <Grid size={{ xs: 12, sm: 6 }}>
//                       <FormControl fullWidth>
//                         <InputLabel sx={{ fontFamily: F_BODY }}>
//                           Підкатегорія
//                         </InputLabel>
//                         <Select
//                           name="subcategoryId"
//                           label="Підкатегорія"
//                           value={selectedSubCatId}
//                           onChange={(e) => setSelectedSubCatId(e.target.value)}
//                           sx={selectSx}
//                         >
//                           <MenuItem
//                             value=""
//                             sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
//                           >
//                             <em>Виберіть підкатегорію</em>
//                           </MenuItem>
//                           {subcategories.map((sub) => (
//                             <MenuItem
//                               key={sub.id}
//                               value={sub.id}
//                               sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
//                             >
//                               {sub.name}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   )}
//                 </Grid>

//                 <TextField
//                   name="description"
//                   label="Опис"
//                   required
//                   fullWidth
//                   multiline
//                   rows={5}
//                   defaultValue={ad.description}
//                   inputProps={{ minLength: 10, maxLength: 5000 }}
//                   helperText="Від 10 до 5 000 символів"
//                   sx={inputSx}
//                 />

//                 <Grid container spacing={2}>
//                   <Grid size={{ xs: 12, sm: 4 }}>
//                     <TextField
//                       name="price"
//                       label="Ціна (необов'язково)"
//                       type="number"
//                       fullWidth
//                       defaultValue={ad.price}
//                       inputProps={{ min: 0, step: 0.01 }}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <EuroIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={inputSx}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, sm: 4 }}>
//                     <FormControl fullWidth>
//                       <InputLabel sx={{ fontFamily: F_BODY }}>
//                         Статус
//                       </InputLabel>
//                       <Select
//                         name="status"
//                         label="Статус"
//                         defaultValue={ad.status || "Active"}
//                         sx={selectSx}
//                       >
//                         <MenuItem value="Active" sx={{ fontFamily: F_BODY }}>
//                           Активне
//                         </MenuItem>
//                         <MenuItem value="Inactive" sx={{ fontFamily: F_BODY }}>
//                           Неактивне
//                         </MenuItem>
//                         <MenuItem value="Sold" sx={{ fontFamily: F_BODY }}>
//                           Продано
//                         </MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 </Grid>
//               </Box>
//             </EditSection>

//             <Divider sx={{ my: 4, borderColor: "#f1f5f9" }} />

//             {/* ── Section 2: Location ── */}
//             <EditSection icon="location_on" title="Місцезнаходження">
//               {locationLoading && (
//                 <LinearProgress
//                   sx={{
//                     mb: 2,
//                     borderRadius: "99px",
//                     bgcolor: "#eff6ff",
//                     "& .MuiLinearProgress-bar": { bgcolor: BLUE },
//                   }}
//                 />
//               )}
//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <FormControl fullWidth required>
//                     <InputLabel sx={{ fontFamily: F_BODY }}>Країна</InputLabel>
//                     <Select
//                       name="country"
//                       label="Країна"
//                       value={countries.length > 0 ? selectedCountry : ""}
//                       onChange={handleCountryChange}
//                       sx={selectSx}
//                       disabled={locationLoading && countries.length === 0}
//                     >
//                       {countries.map((c) => (
//                         <MenuItem
//                           key={c.id}
//                           value={c.name}
//                           sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
//                         >
//                           {c.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 {selectedCountry && states.length > 0 && (
//                   <Grid size={{ xs: 12, sm: 4 }}>
//                     <FormControl fullWidth required disabled={locationLoading}>
//                       <InputLabel sx={{ fontFamily: F_BODY }}>
//                         Регіон
//                       </InputLabel>
//                       <Select
//                         name="state"
//                         label="Регіон"
//                         value={selectedState}
//                         onChange={handleStateChange}
//                         sx={selectSx}
//                       >
//                         {states.map((s) => (
//                           <MenuItem
//                             key={s.id}
//                             value={s.name}
//                             sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
//                           >
//                             {s.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 )}

//                 {selectedState && cities.length > 0 && (
//                   <Grid size={{ xs: 12, sm: 4 }}>
//                     <FormControl fullWidth required disabled={locationLoading}>
//                       <InputLabel sx={{ fontFamily: F_BODY }}>Місто</InputLabel>
//                       <Select
//                         name="city"
//                         label="Місто"
//                         value={selectedCity}
//                         onChange={(e) => setSelectedCity(e.target.value)}
//                         sx={selectSx}
//                       >
//                         {cities.map((c) => (
//                           <MenuItem
//                             key={c.id}
//                             value={c.name}
//                             sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
//                           >
//                             {c.name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 )}

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     name="location"
//                     label="Точна адреса або квартал"
//                     fullWidth
//                     defaultValue={ad.location}
//                     placeholder="вул. Головна, 12 або центр міста"
//                     sx={inputSx}
//                   />
//                 </Grid>
//               </Grid>
//             </EditSection>

//             <Divider sx={{ my: 4, borderColor: "#f1f5f9" }} />

//             {/* ── Section 3: Contacts ── */}
//             <EditSection icon="contact_phone" title="Контактна інформація">
//               <Grid container spacing={2.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     name="email"
//                     label="Email"
//                     type="email"
//                     fullWidth
//                     defaultValue={ad.email}
//                     sx={inputSx}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 4, sm: 2 }}>
//                   <TextField
//                     label="Код"
//                     value={phoneCode ? `+${phoneCode}` : ""}
//                     disabled
//                     fullWidth
//                     sx={{
//                       ...inputSx,
//                       "& .MuiOutlinedInput-root": {
//                         ...inputSx["& .MuiOutlinedInput-root"],
//                         bgcolor: "#f1f5f9",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 8, sm: 4 }}>
//                   <TextField
//                     name="phone"
//                     label="Телефон"
//                     type="tel"
//                     fullWidth
//                     defaultValue={ad.phone || ""}
//                     helperText="Формат: 0123456789"
//                     sx={inputSx}
//                   />
//                 </Grid>
//               </Grid>
//             </EditSection>

//             <Divider sx={{ my: 4, borderColor: "#f1f5f9" }} />

//             {/* ── Section 4: Photos ── */}
//             <EditSection
//               icon="photo_library"
//               title={`Фотографії (${totalPhotos}/5)`}
//             >
//               {/* Existing photos */}
//               {existingPhotos.length > 0 && (
//                 <Box sx={{ mb: 3 }}>
//                   <Typography
//                     sx={{
//                       fontFamily: F_BODY,
//                       fontWeight: 600,
//                       fontSize: "0.82rem",
//                       color: "#64748b",
//                       mb: 1.5,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.04em",
//                     }}
//                   >
//                     Поточні фото
//                   </Typography>
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
//                     {existingPhotos.map((path, i) => {
//                       console.log("path photo >>>>>", path);
//                       console.log("i photo >>>>>", i);
//                       return (
//                         <Box
//                           key={path}
//                           sx={{
//                             position: "relative",
//                             width: 96,
//                             height: 96,
//                             borderRadius: "12px",
//                             overflow: "hidden",
//                             border:
//                               i === 0
//                                 ? `2px solid ${BLUE}`
//                                 : "2px solid #e2e8f0",
//                             boxShadow:
//                               i === 0 ? "0 4px 12px rgba(0,87,184,.2)" : "none",
//                           }}
//                         >
//                           <Box
//                             component="img"
//                             // src={path}
//                             src={path.startsWith("http") ? path : `${apiUrl}/uploads/adv/${path.replace(/^public\/uploads\/adv\//, "")}`}
//                             alt={`existing-${i}`}
//                             sx={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                           />
//                           {i === 0 && (
//                             <Box
//                               sx={{
//                                 position: "absolute",
//                                 bottom: 5,
//                                 left: 5,
//                                 px: 0.75,
//                                 py: 0.25,
//                                 borderRadius: "5px",
//                                 bgcolor: BLUE,
//                               }}
//                             >
//                               <Typography
//                                 sx={{
//                                   fontFamily: F_BODY,
//                                   fontWeight: 700,
//                                   fontSize: "0.6rem",
//                                   color: "#fff",
//                                 }}
//                               >
//                                 Головна
//                               </Typography>
//                             </Box>
//                           )}
//                           <IconButton
//                             size="small"
//                             onClick={() => removeExistingPhoto(path)}
//                             sx={{
//                               position: "absolute",
//                               top: 3,
//                               right: 3,
//                               width: 20,
//                               height: 20,
//                               bgcolor: "rgba(0,0,0,.6)",
//                               color: "#fff",
//                               "&:hover": { bgcolor: "rgba(239,68,68,.9)" },
//                             }}
//                           >
//                             <CloseIcon sx={{ fontSize: 11 }} />
//                           </IconButton>
//                         </Box>
//                       );
//                     })}
//                   </Box>
//                 </Box>
//               )}

//               {/* New photos preview */}
//               {newPhotos.length > 0 && (
//                 <Box sx={{ mb: 2 }}>
//                   <Typography
//                     sx={{
//                       fontFamily: F_BODY,
//                       fontWeight: 600,
//                       fontSize: "0.82rem",
//                       color: "#64748b",
//                       mb: 1.5,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.04em",
//                     }}
//                   >
//                     Нові фото
//                   </Typography>
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
//                     {newPhotos.map(({ url }, i) => (
//                       <Box
//                         key={i}
//                         sx={{
//                           position: "relative",
//                           width: 96,
//                           height: 96,
//                           borderRadius: "12px",
//                           overflow: "hidden",
//                           border: "2px solid #a7f3d0",
//                           boxShadow: "0 4px 12px rgba(16,185,129,.15)",
//                         }}
//                       >
//                         <Box
//                           component="img"
//                           src={url}
//                           alt={`new-${i}`}
//                           sx={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                         />
//                         <Box
//                           sx={{
//                             position: "absolute",
//                             bottom: 5,
//                             left: 5,
//                             px: 0.75,
//                             py: 0.25,
//                             borderRadius: "5px",
//                             bgcolor: "#10b981",
//                           }}
//                         >
//                           <Typography
//                             sx={{
//                               fontFamily: F_BODY,
//                               fontWeight: 700,
//                               fontSize: "0.6rem",
//                               color: "#fff",
//                             }}
//                           >
//                             Нове
//                           </Typography>
//                         </Box>
//                         <IconButton
//                           size="small"
//                           onClick={() => removeNewPhoto(i)}
//                           sx={{
//                             position: "absolute",
//                             top: 3,
//                             right: 3,
//                             width: 20,
//                             height: 20,
//                             bgcolor: "rgba(0,0,0,.6)",
//                             color: "#fff",
//                             "&:hover": { bgcolor: "rgba(239,68,68,.9)" },
//                           }}
//                         >
//                           <CloseIcon sx={{ fontSize: 11 }} />
//                         </IconButton>
//                       </Box>
//                     ))}
//                   </Box>
//                 </Box>
//               )}

//               {/* Dropzone — only show if under 5 photos */}
//               {totalPhotos < 5 && (
//                 <Box
//                   {...getRootProps()}
//                   sx={{
//                     border: "2px dashed",
//                     borderColor: isDragActive ? BLUE : "#e2e8f0",
//                     borderRadius: "16px",
//                     p: { xs: 3, md: 4 },
//                     textAlign: "center",
//                     cursor: "pointer",
//                     bgcolor: isDragActive ? "#eff6ff" : "#fafbfc",
//                     transition: "all 0.2s ease",
//                     "&:hover": { borderColor: BLUE, bgcolor: "#eff6ff" },
//                   }}
//                 >
//                   <input {...getInputProps({ name: "photos" })} />
//                   <CloudUploadOutlinedIcon
//                     sx={{
//                       fontSize: 36,
//                       mb: 1,
//                       color: isDragActive ? BLUE : "#94a3b8",
//                       transition: "color 0.2s",
//                     }}
//                   />
//                   <Typography
//                     sx={{
//                       fontFamily: F_BODY,
//                       fontWeight: 700,
//                       fontSize: "0.9rem",
//                       color: isDragActive ? BLUE : "#334155",
//                       mb: 0.5,
//                     }}
//                   >
//                     {isDragActive
//                       ? "Відпустіть тут..."
//                       : `Додати фото (ще ${5 - totalPhotos})`}
//                   </Typography>
//                   <Typography
//                     sx={{
//                       fontFamily: F_BODY,
//                       fontSize: "0.78rem",
//                       color: "#94a3b8",
//                     }}
//                   >
//                     JPG, PNG, WebP — до 5 MB кожен
//                   </Typography>
//                 </Box>
//               )}

//               {totalPhotos >= 5 && (
//                 <Box
//                   sx={{
//                     p: 2,
//                     borderRadius: "12px",
//                     bgcolor: "#fffbeb",
//                     border: "1px solid #fde68a",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                   }}
//                 >
//                   <CheckCircleIcon sx={{ fontSize: 16, color: "#d97706" }} />
//                   <Typography
//                     sx={{
//                       fontFamily: F_BODY,
//                       fontSize: "0.82rem",
//                       color: "#92400e",
//                     }}
//                   >
//                     Максимум 5 фото досягнуто. Видаліть фото щоб додати нові.
//                   </Typography>
//                 </Box>
//               )}
//             </EditSection>

//             {/* ── Action buttons ── */}
//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 2,
//                 justifyContent: "flex-end",
//                 mt: 5,
//                 pt: 4,
//                 borderTop: "1px solid #f1f5f9",
//               }}
//             >
//               <Button
//                 variant="outlined"
//                 component={Link}
//                 to={cancelHref}
//                 disabled={isSubmitting}
//                 startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
//                 sx={{
//                   fontFamily: F_BODY,
//                   fontWeight: 700,
//                   textTransform: "none",
//                   borderRadius: "12px",
//                   px: 3,
//                   py: 1.3,
//                   borderColor: "#e2e8f0",
//                   color: "#64748b",
//                   "&:hover": { borderColor: "#0f172a", color: "#0f172a" },
//                 }}
//               >
//                 Скасувати
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={isSubmitting}
//                 startIcon={
//                   isSubmitting ? (
//                     <CircularProgress size={16} sx={{ color: "#fff" }} />
//                   ) : (
//                     <SaveOutlinedIcon />
//                   )
//                 }
//                 sx={{
//                   fontFamily: F_BODY,
//                   fontWeight: 700,
//                   textTransform: "none",
//                   bgcolor: BLUE,
//                   borderRadius: "12px",
//                   px: 4,
//                   py: 1.3,
//                   fontSize: "0.95rem",
//                   boxShadow: "0 4px 14px rgba(0,87,184,.35)",
//                   "&:hover": {
//                     bgcolor: "#003d82",
//                     transform: "translateY(-1px)",
//                     boxShadow: "0 6px 20px rgba(0,87,184,.45)",
//                   },
//                   "&:disabled": { bgcolor: "#94a3b8", boxShadow: "none" },
//                   transition: "all 0.25s ease",
//                 }}
//               >
//                 {isSubmitting ? "Збереження..." : "Зберегти зміни"}
//               </Button>
//             </Box>
//           </Paper>
//         </Form>
//       </Box>
//     </Box>
//   );
// }
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  useLoaderData,
  Form,
  redirect,
  Link,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useDropzone } from "react-dropzone";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

/* ── Loader / Action ── */
export const loader = async ({ params }) => {
  try {
    const [adRes, catsRes] = await Promise.all([
      customFetch.get(`/adv/${params.id}`),
      customFetch.get("/categories"),
    ]);
    return { ad: adRes.data, categories: catsRes.data || [] };
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка завантаження оголошення",
    );
    return { ad: {}, categories: [] };
  }
};

export const action = async ({ request, params }) => {
  const formData = new FormData();
  const data = await request.formData();

  // Copy all fields except photos (handled separately)
  for (const [key, value] of data.entries()) {
    if (key !== "photos") formData.append(key, value);
  }
  // Append new photo files
  data.getAll("photos").forEach((photo) => formData.append("photos", photo));

  try {
    await customFetch.put(`/adv/${params.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Оголошення оновлено успішно");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка оновлення");
    return { error: error?.response?.data?.message };
  }
  const referer = request.headers.get("Referer") || "";
  return redirect("/profile");
};

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: F_BODY,
    bgcolor: "#f8fafc",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: BLUE },
    "&.Mui-focused fieldset": { borderColor: BLUE, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
  "& .MuiInputLabel-root": { fontFamily: F_BODY },
  "& .MuiFormHelperText-root": { fontFamily: F_BODY, fontSize: "0.75rem" },
};

const selectSx = {
  borderRadius: "12px",
  fontFamily: F_BODY,
  bgcolor: "#f8fafc",
  "& fieldset": { borderColor: "#e2e8f0" },
  "&:hover fieldset": { borderColor: BLUE },
  "&.Mui-focused fieldset": { borderColor: BLUE },
};

/* ── Section with accent bar ── */
function EditSection({ icon, title, subtitle, completed, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: `1.5px solid ${completed ? "#a7f3d0" : "#e2e8f0"}`,
        overflow: "hidden",
        boxShadow: completed
          ? "0 4px 20px rgba(16,185,129,.08)"
          : "0 4px 24px rgba(0,87,184,.05)",
        transition: "border-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2.5,
          borderBottom: `1px solid ${completed ? "#a7f3d0" : "#f1f5f9"}`,
          bgcolor: completed ? "#f0fdf4" : "#fafbfc",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: completed ? "#10b981" : BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.3s",
          }}
        >
          <span
            className="material-icons"
            style={{ fontSize: 18, color: "#fff" }}
          >
            {completed ? "check_circle" : icon}
          </span>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#0f172a",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.78rem", color: "#64748b" }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ p: { xs: 3, md: 4 } }}>{children}</Box>
    </Paper>
  );
}

/* ── Existing photo thumbnail ── */
function ExistingPhoto({ path, index, isMain, onRemove, onSetMain }) {
  const src = path
    ? path.startsWith("http")
      ? path
      : path.includes("public/uploads/adv/")
        ? `${apiUrl}/uploads/adv/${path.split("public/uploads/adv/")[1]}`
        : path.startsWith("/uploads/")
          ? `${apiUrl}${path}`
          : `${apiUrl}/uploads/adv/${path.replace(/^public\/uploads\/adv\//, "")}`
    : "";

  return (
    <Box
      sx={{
        position: "relative",
        width: 96,
        height: 96,
        borderRadius: "12px",
        overflow: "hidden",
        border: isMain ? `2px solid ${BLUE}` : "2px solid #e2e8f0",
        boxShadow: isMain ? `0 4px 12px rgba(0,87,184,.2)` : "none",
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={`photo-${index}`}
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Main badge */}
      {isMain && (
        <Box
          sx={{
            position: "absolute",
            bottom: 5,
            left: 5,
            px: 0.75,
            py: 0.25,
            borderRadius: "5px",
            bgcolor: BLUE,
          }}
        >
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              fontSize: "0.6rem",
              color: "#fff",
            }}
          >
            Головна
          </Typography>
        </Box>
      )}

      {/* Actions overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 3,
          right: 3,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Tooltip title={isMain ? "Вже головна" : "Зробити головною"}>
          <IconButton
            size="small"
            onClick={() => onSetMain(index)}
            sx={{
              width: 20,
              height: 20,
              bgcolor: isMain ? GOLD : "rgba(0,0,0,.5)",
              color: isMain ? "#003d82" : "#fff",
              "&:hover": { bgcolor: GOLD, color: "#003d82" },
            }}
          >
            {isMain ? (
              <StarIcon sx={{ fontSize: 11 }} />
            ) : (
              <StarBorderIcon sx={{ fontSize: 11 }} />
            )}
          </IconButton>
        </Tooltip>
        <IconButton
          size="small"
          onClick={() => onRemove(index)}
          sx={{
            width: 20,
            height: 20,
            bgcolor: "rgba(0,0,0,.55)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(239,68,68,.9)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 11 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

/* ── New photo preview ── */
function NewPhoto({ url, index, onRemove }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: 96,
        height: 96,
        borderRadius: "12px",
        overflow: "hidden",
        border: "2px dashed #93c5fd",
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={url}
        alt={`new-${index}`}
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 3,
          left: 3,
          px: 0.75,
          py: 0.25,
          borderRadius: "5px",
          bgcolor: "#3b82f6",
        }}
      >
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontWeight: 700,
            fontSize: "0.6rem",
            color: "#fff",
          }}
        >
          Нова
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={() => onRemove(index)}
        sx={{
          position: "absolute",
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          bgcolor: "rgba(0,0,0,.55)",
          color: "#fff",
          "&:hover": { bgcolor: "rgba(239,68,68,.9)" },
        }}
      >
        <CloseIcon sx={{ fontSize: 11 }} />
      </IconButton>
    </Box>
  );
}

/* ── Main Component ── */
export default function EditAdPage() {
  const { ad, categories } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  /* ── Existing photos state ── */
  const [existingPhotos, setExistingPhotos] = useState(ad.photos || []);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const [newPhotoFiles, setNewPhotoFiles] = useState([]); // { file, url }

  /* ── Category / subcategory state ── */
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    ad.categoryId || ad.category?.id || "",
  );
  const [selectedSubCatId, setSelectedSubCatId] = useState(
    ad.subcategoryId || ad.subcategory?.id || "",
  );

  /* ── Location state ── */
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(ad.country || "");
  const [selectedState, setSelectedState] = useState(ad.state || "");
  const [selectedCity, setSelectedCity] = useState(ad.city || "");
  const [phoneCode, setPhoneCode] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  /* Load European countries */
  useEffect(() => {
    setLocationLoading(true);
    GetCountries()
      .then((all) => setCountries(all.filter((c) => c.region === "Europe")))
      .catch(() => toast.error("Помилка завантаження країн"))
      .finally(() => setLocationLoading(false));
  }, []);

  /* Load states when country changes */
  useEffect(() => {
    if (!selectedCountry) return;
    const countryObj = countries.find((c) => c.name === selectedCountry);
    if (!countryObj) return;
    setLocationLoading(true);
    GetState(countryObj.id)
      .then((list) => {
        setStates(list);
        if (countryObj.phone_code) setPhoneCode(countryObj.phone_code);
        // Only reset if user actively changed country (not on initial load)
        if (selectedCountry !== ad.country) {
          setSelectedState("");
          setCities([]);
          setSelectedCity("");
        }
      })
      .catch(() => {})
      .finally(() => setLocationLoading(false));
  }, [selectedCountry, countries]);

  /* Load cities when state changes */
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;
    const countryObj = countries.find((c) => c.name === selectedCountry);
    const stateObj = states.find((s) => s.name === selectedState);
    if (!countryObj || !stateObj) return;
    setLocationLoading(true);
    GetCity(countryObj.id, stateObj.id)
      .then((list) => {
        setCities(list);
        if (selectedState !== ad.state) setSelectedCity("");
      })
      .catch(() => {})
      .finally(() => setLocationLoading(false));
  }, [selectedState, selectedCountry, countries, states]);

  /* Subcategories for selected category */
  const subcategories = useMemo(() => {
    if (!Array.isArray(categories) || !selectedCategoryId) return [];
    return (
      categories.find((c) => String(c.id) === String(selectedCategoryId))
        ?.SubCategories || []
    );
  }, [categories, selectedCategoryId]);

  /* ── Photo dropzone ── */
  const onDrop = useCallback(
    (acceptedFiles) => {
      const maxSize = 5 * 1024 * 1024;
      const valid = acceptedFiles.filter((f) => {
        if (f.size > maxSize) {
          toast.error(`${f.name} > 5MB`);
          return false;
        }
        return true;
      });
      if (!valid.length) return;
      const totalPhotos =
        existingPhotos.length + newPhotoFiles.length + valid.length;
      if (totalPhotos > 5) {
        toast.warning("Максимум 5 фото загалом");
        const allowed = Math.max(
          0,
          5 - existingPhotos.length - newPhotoFiles.length,
        );
        setNewPhotoFiles((prev) => [
          ...prev,
          ...valid
            .slice(0, allowed)
            .map((f) => ({ file: f, url: URL.createObjectURL(f) })),
        ]);
        return;
      }
      setNewPhotoFiles((prev) => [
        ...prev,
        ...valid.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
      ]);
    },
    [existingPhotos.length, newPhotoFiles.length],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    onDrop,
    multiple: true,
    maxFiles: 5,
  });

  const removeExistingPhoto = (idx) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx));
    if (mainPhotoIndex >= idx && mainPhotoIndex > 0) {
      setMainPhotoIndex((prev) => prev - 1);
    }
  };

  const removeNewPhoto = (idx) => {
    setNewPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = useSubmit();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    newPhotoFiles.forEach(({ file }) => formData.append("photos", file));
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  const totalPhotos = existingPhotos.length + newPhotoFiles.length;

  /* Context: profile vs dashboard */
  const isProfile =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/profile/");
  const cancelHref = isProfile ? "/profile" : "/dashboard/ads";

  if (!ad?.title && !ad?.id) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontSize: "1.4rem",
              color: "#94a3b8",
              mb: 2,
            }}
          >
            Оголошення не знайдено
          </Typography>
          <Button
            component={Link}
            to={cancelHref}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: BLUE,
            }}
          >
            ← Назад
          </Button>
        </Box>
      </Box>
    );
  }

  /* Completion checks for section indicators */
  const step1Done = !!(selectedCategoryId && selectedSubCatId);
  const step2Done = !!(selectedCountry && selectedState && selectedCity);
  const step3Done = true;
  const step4Done = totalPhotos > 0;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
          py: { xs: 5, md: 7 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #FFD700 30%, #FFD700 70%, transparent)",
            opacity: 0.7,
          }}
        />

        <Box
          sx={{
            maxWidth: 960,
            mx: "auto",
            px: { xs: 2, md: 4 },
            position: "relative",
          }}
        >
          <Button
            component={Link}
            to={cancelHref}
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: "rgba(255,255,255,.7)",
              mb: 3,
              p: 0,
              "&:hover": { color: "#fff", bgcolor: "transparent" },
            }}
          >
            {isProfile ? "Назад до профілю" : "Назад до оголошень"}
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: { xs: "1.6rem", md: "2rem" },
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  mb: 0.5,
                }}
              >
                Редагувати оголошення
              </Typography>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,.6)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 500,
                }}
              >
                {ad.title}
              </Typography>
            </Box>
            <Chip
              label={`ID: ${ad.id}`}
              sx={{
                fontFamily: F_BODY,
                fontWeight: 700,
                fontSize: "0.72rem",
                bgcolor: "rgba(255,255,255,.12)",
                color: "rgba(255,255,255,.7)",
                border: "1px solid rgba(255,255,255,.2)",
                alignSelf: "flex-start",
                mt: 0.5,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ── Progress bar ── */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9" }}>
        <Box sx={{ maxWidth: 960, mx: "auto", px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: "flex", gap: 0, py: 2 }}>
            {[
              { label: "Категорія", done: step1Done },
              { label: "Локація", done: step2Done },
              { label: "Контакти", done: step3Done },
              { label: "Фото", done: step4Done },
            ].map((s, i) => (
              <Box
                key={s.label}
                sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    opacity: s.done ? 1 : 0.5,
                    transition: "opacity 0.3s",
                  }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      bgcolor: s.done ? "#10b981" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.3s",
                    }}
                  >
                    {s.done ? (
                      <span
                        className="material-icons"
                        style={{ fontSize: 14, color: "#fff" }}
                      >
                        check
                      </span>
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          color: "#94a3b8",
                        }}
                      >
                        {i + 1}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      color: s.done ? "#065f46" : "#94a3b8",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {s.label}
                  </Typography>
                </Box>
                {i < 3 && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      bgcolor: s.done ? "#10b981" : "#e2e8f0",
                      mx: 1,
                      borderRadius: "99px",
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Form ── */}
      <Box
        sx={{
          maxWidth: 860,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Hidden field: pass remaining existing photos as JSON */}
          <input
            type="hidden"
            name="existingPhotos"
            value={JSON.stringify(existingPhotos)}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* ── STEP 1: Basic info + Category ── */}
            <EditSection
              icon="edit_note"
              title="Основна інформація"
              subtitle="Назва, категорія та опис"
              completed={step1Done}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  name="title"
                  label="Заголовок"
                  required
                  fullWidth
                  defaultValue={ad.title}
                  sx={inputSx}
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel sx={{ fontFamily: F_BODY }}>
                        Категорія
                      </InputLabel>
                      <Select
                        name="categoryId"
                        label="Категорія"
                        value={selectedCategoryId}
                        onChange={(e) => {
                          setSelectedCategoryId(e.target.value);
                          setSelectedSubCatId("");
                        }}
                        sx={selectSx}
                      >
                        <MenuItem
                          value=""
                          sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                        >
                          <em>Виберіть категорію</em>
                        </MenuItem>
                        {Array.isArray(categories) &&
                          categories.map((cat) => (
                            <MenuItem
                              key={cat.id}
                              value={cat.id}
                              sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                            >
                              {cat.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {selectedCategoryId && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontFamily: F_BODY }}>
                          Підкатегорія
                        </InputLabel>
                        <Select
                          name="subcategoryId"
                          label="Підкатегорія"
                          value={selectedSubCatId}
                          onChange={(e) => setSelectedSubCatId(e.target.value)}
                          sx={selectSx}
                        >
                          <MenuItem
                            value=""
                            sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                          >
                            <em>Виберіть підкатегорію</em>
                          </MenuItem>
                          {subcategories.map((sub) => (
                            <MenuItem
                              key={sub.id}
                              value={sub.id}
                              sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                            >
                              {sub.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>

                <TextField
                  name="description"
                  label="Опис"
                  required
                  fullWidth
                  multiline
                  rows={5}
                  defaultValue={ad.description}
                  inputProps={{ minLength: 10, maxLength: 5000 }}
                  helperText="Від 10 до 5 000 символів"
                  sx={inputSx}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    name="price"
                    label="Ціна (€)"
                    type="number"
                    defaultValue={ad.price || ""}
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ ...inputSx, maxWidth: 200 }}
                  />
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel sx={{ fontFamily: F_BODY }}>Статус</InputLabel>
                    <Select
                      name="status"
                      label="Статус"
                      defaultValue={ad.status || "Active"}
                      sx={selectSx}
                    >
                      <MenuItem value="Active" sx={{ fontFamily: F_BODY }}>
                        Активне
                      </MenuItem>
                      <MenuItem value="Inactive" sx={{ fontFamily: F_BODY }}>
                        Неактивне
                      </MenuItem>
                      <MenuItem value="Sold" sx={{ fontFamily: F_BODY }}>
                        Продано
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </EditSection>

            {/* ── STEP 2: Location ── */}
            <EditSection
              icon="location_on"
              title="Місцезнаходження"
              subtitle="Країна, регіон та місто"
              completed={step2Done}
            >
              {locationLoading && (
                <LinearProgress
                  sx={{
                    mb: 2,
                    borderRadius: "99px",
                    bgcolor: "#eff6ff",
                    "& .MuiLinearProgress-bar": { bgcolor: BLUE },
                  }}
                />
              )}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ fontFamily: F_BODY }}>Країна</InputLabel>
                    <Select
                      name="country"
                      label="Країна"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      sx={selectSx}
                      disabled={locationLoading && countries.length === 0}
                    >
                      {countries.map((c) => (
                        <MenuItem
                          key={c.id}
                          value={c.name}
                          sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                        >
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {selectedCountry && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth required disabled={locationLoading}>
                      <InputLabel sx={{ fontFamily: F_BODY }}>
                        Регіон
                      </InputLabel>
                      <Select
                        name="state"
                        label="Регіон"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        sx={selectSx}
                      >
                        {states.map((s) => (
                          <MenuItem
                            key={s.id}
                            value={s.name}
                            sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                          >
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {selectedState && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl
                      fullWidth
                      required
                      disabled={locationLoading || cities.length === 0}
                    >
                      <InputLabel sx={{ fontFamily: F_BODY }}>Місто</InputLabel>
                      <Select
                        name="city"
                        label="Місто"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        sx={selectSx}
                      >
                        {cities.map((c) => (
                          <MenuItem
                            key={c.id}
                            value={c.name}
                            sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                          >
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    name="location"
                    label="Точна адреса або квартал"
                    fullWidth
                    defaultValue={ad.location || ""}
                    placeholder="вул. Головна, 12 або центр міста"
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </EditSection>

            {/* ── STEP 3: Contact ── */}
            <EditSection
              icon="contact_phone"
              title="Контактна інформація"
              subtitle="Як з вами зв'язатися"
              completed={step3Done}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    defaultValue={ad.email || ""}
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField
                    label="Код"
                    value={phoneCode ? `+${phoneCode}` : ""}
                    disabled
                    fullWidth
                    sx={{
                      ...inputSx,
                      "& .MuiOutlinedInput-root": {
                        ...inputSx["& .MuiOutlinedInput-root"],
                        bgcolor: "#f1f5f9",
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 8, sm: 4 }}>
                  <TextField
                    name="phone"
                    label="Телефон"
                    type="tel"
                    fullWidth
                    defaultValue={ad.phone || ""}
                    helperText="Формат: 0123456789"
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </EditSection>

            {/* ── STEP 4: Photos ── */}
            <EditSection
              icon="photo_library"
              title={`Фотографії (${totalPhotos}/5)`}
              subtitle="Керуйте існуючими фото та додавайте нові"
              completed={step4Done}
            >
              {/* Existing photos */}
              {existingPhotos.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      color: "#334155",
                      mb: 1.5,
                    }}
                  >
                    Поточні фото — клікніть ⭐ щоб встановити головне
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {existingPhotos.map((path, idx) => (
                      <ExistingPhoto
                        key={`exist-${idx}`}
                        path={path}
                        index={idx}
                        isMain={idx === mainPhotoIndex}
                        onRemove={removeExistingPhoto}
                        onSetMain={setMainPhotoIndex}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* New photos preview */}
              {newPhotoFiles.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      color: "#334155",
                      mb: 1.5,
                    }}
                  >
                    Нові фото (будуть додані)
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {newPhotoFiles.map(({ url, file }, idx) => (
                      <Box key={`new-${idx}`}>
                        <NewPhoto
                          url={url}
                          index={idx}
                          onRemove={removeNewPhoto}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Dropzone */}
              {totalPhotos < 5 && (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "2px dashed",
                    borderColor: isDragActive ? BLUE : "#e2e8f0",
                    borderRadius: "16px",
                    p: { xs: 3, md: 4 },
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: isDragActive ? "#eff6ff" : "#fafbfc",
                    transition: "all 0.2s ease",
                    "&:hover": { borderColor: BLUE, bgcolor: "#eff6ff" },
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUploadOutlinedIcon
                    sx={{
                      fontSize: 36,
                      mb: 1.5,
                      color: isDragActive ? BLUE : "#94a3b8",
                      transition: "color 0.2s",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: isDragActive ? BLUE : "#334155",
                      mb: 0.5,
                    }}
                  >
                    {isDragActive
                      ? "Відпустіть тут..."
                      : `Додати ще фото (залишилось ${5 - totalPhotos})`}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.78rem",
                      color: "#94a3b8",
                    }}
                  >
                    JPG, PNG, WebP · до 5 MB кожен
                  </Typography>
                </Box>
              )}

              {totalPhotos === 0 && (
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: "10px",
                    bgcolor: "#fef2f2",
                    border: "1px solid #fecaca",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.8rem",
                      color: "#991b1b",
                    }}
                  >
                    ⚠️ Рекомендується додати хоча б одне фото — оголошення з
                    фото отримують більше відгуків
                  </Typography>
                </Box>
              )}
            </EditSection>

            {/* ── Submit bar ── */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                pt: 2,
                pb: 4,
              }}
            >
              <Button
                variant="outlined"
                component={Link}
                to={cancelHref}
                disabled={isSubmitting}
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.3,
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": { borderColor: "#0f172a", color: "#0f172a" },
                }}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                  ) : (
                    <SaveOutlinedIcon />
                  )
                }
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: BLUE,
                  borderRadius: "12px",
                  px: 4,
                  py: 1.3,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 14px rgba(0,87,184,.35)",
                  "&:hover": {
                    bgcolor: "#003d82",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(0,87,184,.45)",
                  },
                  "&:disabled": { bgcolor: "#94a3b8", boxShadow: "none" },
                  transition: "all 0.25s ease",
                }}
              >
                {isSubmitting ? "Збереження..." : "Зберегти зміни"}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
