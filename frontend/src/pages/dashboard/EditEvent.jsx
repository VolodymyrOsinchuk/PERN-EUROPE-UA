import {
  useLoaderData,
  Form,
  redirect,
  Link,
  useNavigation,
} from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { PageHeader } from "../../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/events/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка завантаження події");
    return null;
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const payload = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
  };
  try {
    await customFetch.put(`/events/${params.id}`, payload);
    toast.success("Подію оновлено!");
    return redirect("/dashboard/events");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка оновлення");
    return { error: error?.response?.data?.message };
  }
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#f8fafc",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: "#2563EB" },
    "&.Mui-focused fieldset": { borderColor: "#2563EB" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2563EB" },
};

export default function DashboardEditEvent() {
  const event = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (!event) {
    return (
      <Box>
        <Typography>Подію не знайдено</Typography>
        <Button
          component={Link}
          to="/dashboard/events"
          startIcon={<ArrowBackIcon />}
        >
          Назад
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Редагувати подію"
        subtitle={event.title}
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Події", to: "/dashboard/events" },
          { label: "Редагувати" },
        ]}
      />

      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 700 }}>
        <Form method="post">
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Назва події"
                required
                fullWidth
                defaultValue={event.title}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventOutlinedIcon
                        sx={{ fontSize: 16, color: "#94a3b8" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                name="date"
                label="Дата події"
                type="date"
                required
                fullWidth
                defaultValue={
                  event.date
                    ? new Date(event.date).toISOString().split("T")[0]
                    : ""
                }
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />
            </Grid>

            <Grid item xs={12} sm={7}>
              <TextField
                name="location"
                label="Місце проведення"
                required
                fullWidth
                defaultValue={event.location}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon
                        sx={{ fontSize: 16, color: "#94a3b8" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Опис"
                required
                fullWidth
                multiline
                rows={5}
                defaultValue={event.description}
                inputProps={{ minLength: 10 }}
                sx={inputSx}
              />
            </Grid>
          </Grid>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}
          >
            <Button
              variant="outlined"
              component={Link}
              to="/dashboard/events"
              disabled={isSubmitting}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
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
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
              }}
            >
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </Button>
          </Box>
        </Form>
      </Paper>
    </Box>
  );
}
