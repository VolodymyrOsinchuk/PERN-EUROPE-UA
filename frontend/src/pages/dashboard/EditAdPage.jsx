// import { useLoaderData, Form, redirect } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Grid,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// import { useNavigation } from "react-router-dom";
// import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
// import customFetch from "../../utils/customFetch";
// import { toast } from "react-toastify";
// import PageHeader from "../PageHeader";

// export const loader = async ({ params }) => {
//   try {
//     const { data } = await customFetch.get(`/adv/${params.id}`);
//     return data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//     return {};
//   }
// };

// export const action = async ({ request, params }) => {
//   const formData = await request.formData();
//   try {
//     await customFetch.put(`/adv/${params.id}`, Object.fromEntries(formData));
//     toast.success("Оголошення оновлено");
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
//   return redirect("/dashboard/posts");
// };

// const FieldSection = ({ title, children }) => (
//   <Box sx={{ mb: 3 }}>
//     <Typography
//       variant="caption"
//       sx={{
//         color: "#94A3B8",
//         fontWeight: 700,
//         letterSpacing: "0.08em",
//         textTransform: "uppercase",
//         fontSize: "0.65rem",
//         display: "block",
//         mb: 1.5,
//       }}
//     >
//       {title}
//     </Typography>
//     {children}
//   </Box>
// );

// const EditAdPage = () => {
//   const ad = useLoaderData();
//   const navigation = useNavigation();
//   const isSubmitting = navigation.state === "submitting";

//   return (
//     <Box>
//       <PageHeader
//         title="Редагувати оголошення"
//         subtitle={ad.title}
//         breadcrumbs={[
//           { label: "Панель", to: "/dashboard" },
//           { label: "Оголошення", to: "/dashboard/posts" },
//           { label: "Редагувати" },
//         ]}
//       />

//       <Paper sx={{ p: 3, maxWidth: 860 }}>
//         <Form method="post">
//           <FieldSection title="Основна інформація">
//             <Grid container spacing={2}>
//               <Grid size={{ xs: 12 }}>
//                 <TextField
//                   name="title"
//                   label="Заголовок"
//                   fullWidth
//                   defaultValue={ad.title}
//                   required
//                 />
//               </Grid>
//               <Grid size={{ xs: 12 }}>
//                 <TextField
//                   name="description"
//                   label="Опис"
//                   fullWidth
//                   multiline
//                   rows={4}
//                   defaultValue={ad.description}
//                   required
//                   inputProps={{ minLength: 10, maxLength: 5000 }}
//                   helperText="Від 10 до 5000 символів"
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <TextField
//                   name="price"
//                   label="Ціна (€)"
//                   type="number"
//                   fullWidth
//                   defaultValue={ad.price}
//                   inputProps={{ min: 0, step: 0.01 }}
//                 />
//               </Grid>
//             </Grid>
//           </FieldSection>

//           <Divider sx={{ mb: 3 }} />

//           <FieldSection title="Локалізація">
//             <Grid container spacing={2}>
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <TextField
//                   name="country"
//                   label="Країна"
//                   fullWidth
//                   defaultValue={ad.country}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <TextField
//                   name="state"
//                   label="Регіон"
//                   fullWidth
//                   defaultValue={ad.state}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <TextField
//                   name="city"
//                   label="Місто"
//                   fullWidth
//                   defaultValue={ad.city}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12 }}>
//                 <TextField
//                   name="location"
//                   label="Точна адреса"
//                   fullWidth
//                   defaultValue={ad.location}
//                 />
//               </Grid>
//             </Grid>
//           </FieldSection>

//           <Divider sx={{ mb: 3 }} />

//           <FieldSection title="Контакти">
//             <Grid container spacing={2}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <TextField
//                   name="email"
//                   label="Email"
//                   type="email"
//                   fullWidth
//                   defaultValue={ad.email}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <TextField
//                   name="phone"
//                   label="Телефон"
//                   fullWidth
//                   defaultValue={ad.phone}
//                 />
//               </Grid>
//             </Grid>
//           </FieldSection>

//           <Box
//             sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 1 }}
//           >
//             <Button
//               variant="outlined"
//               color="inherit"
//               component="a"
//               href="/dashboard/posts"
//             >
//               Скасувати
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               disabled={isSubmitting}
//               startIcon={
//                 isSubmitting ? (
//                   <CircularProgress size={15} />
//                 ) : (
//                   <SaveOutlinedIcon />
//                 )
//               }
//             >
//               {isSubmitting ? "Збереження..." : "Зберегти зміни"}
//             </Button>
//           </Box>
//         </Form>
//       </Paper>
//     </Box>
//   );
// };

// export default EditAdPage;
import { useLoaderData, Form, redirect, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigation } from "react-router-dom";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import PageHeader from "../PageHeader";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/adv/${params.id}`);
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка завантаження оголошення",
    );
    return {};
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  try {
    await customFetch.put(`/adv/${params.id}`, Object.fromEntries(formData));
    toast.success("Оголошення оновлено");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка оновлення");
    return { error: error?.response?.data?.message };
  }
  // FIX: était /dashboard/posts — corrigé en /dashboard/ads
  // Pour la route /profile/edit-ad/:id, la redirection sera /profile (gérée par le parent)
  const referer = request.headers.get("Referer") || "";
  if (referer.includes("/profile")) {
    return redirect("/profile");
  }
  return redirect("/dashboard/ads");
};

const FieldSection = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="caption"
      sx={{
        color: "#94A3B8",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontSize: "0.65rem",
        display: "block",
        mb: 1.5,
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

const EditAdPage = () => {
  const ad = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Detect context (profile vs dashboard) from URL
  const isProfile = window.location.pathname.includes("/profile/");
  const cancelHref = isProfile ? "/profile" : "/dashboard/ads";

  return (
    <Box>
      <PageHeader
        title="Редагувати оголошення"
        subtitle={ad?.title || ""}
        breadcrumbs={
          isProfile
            ? [
                { label: "Профіль", to: "/profile" },
                { label: "Редагувати оголошення" },
              ]
            : [
                { label: "Панель", to: "/dashboard" },
                { label: "Оголошення", to: "/dashboard/ads" },
                { label: "Редагувати" },
              ]
        }
      />

      <Paper sx={{ p: 3, maxWidth: 860 }}>
        <Form method="post">
          <FieldSection title="Основна інформація">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="title"
                  label="Заголовок"
                  fullWidth
                  defaultValue={ad?.title}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="description"
                  label="Опис"
                  fullWidth
                  multiline
                  rows={4}
                  defaultValue={ad?.description}
                  required
                  inputProps={{ minLength: 10, maxLength: 5000 }}
                  helperText="Від 10 до 5000 символів"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="price"
                  label="Ціна (€)"
                  type="number"
                  fullWidth
                  defaultValue={ad?.price}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
          </FieldSection>

          <Divider sx={{ mb: 3 }} />

          <FieldSection title="Локалізація">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  name="country"
                  label="Країна"
                  fullWidth
                  defaultValue={ad?.country}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  name="state"
                  label="Регіон"
                  fullWidth
                  defaultValue={ad?.state}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  name="city"
                  label="Місто"
                  fullWidth
                  defaultValue={ad?.city}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="location"
                  label="Точна адреса"
                  fullWidth
                  defaultValue={ad?.location}
                />
              </Grid>
            </Grid>
          </FieldSection>

          <Divider sx={{ mb: 3 }} />

          <FieldSection title="Контакти">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  defaultValue={ad?.email}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="phone"
                  label="Телефон"
                  fullWidth
                  defaultValue={ad?.phone}
                />
              </Grid>
            </Grid>
          </FieldSection>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 1 }}
          >
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to={cancelHref}
              startIcon={<ArrowBackIcon />}
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={15} />
                ) : (
                  <SaveOutlinedIcon />
                )
              }
            >
              {isSubmitting ? "Збереження..." : "Зберегти зміни"}
            </Button>
          </Box>
        </Form>
      </Paper>
    </Box>
  );
};

export default EditAdPage;
