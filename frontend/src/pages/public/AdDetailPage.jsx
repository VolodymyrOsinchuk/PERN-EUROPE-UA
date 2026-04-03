import { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ImageGallery } from "../../components";
import "../../assets/css/adDetailPage.css";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  useLoaderData,
  Form,
  useActionData,
  useNavigation,
} from "react-router-dom";
const apiUrl = import.meta.env.VITE_APP_API_URL;

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/adv/${params.id}`);
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Помилка завантаження деталей оголошення",
    );
    return error;
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "message") {
      const message = formData.get("message");
      // await customFetch.post(`/adv/${params.id}/message`, { message });
      toast.success("Повідомлення надіслано");
    } else if (intent === "report") {
      const reason = formData.get("reason");
      const details = formData.get("details");
      // await customFetch.post(`/adv/${params.id}/report`, { reason, details });
      toast.success("Скаргу надіслано");
    }
    return { success: true };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка при виконанні дії");
    return { error: error?.response?.data?.message || "Error" };
  }
};

const AdDetailPage = () => {
  const ad = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  function MessageDialog({ open, onClose, recipient }) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Form method="post" onSubmit={() => onClose()}>
          <input type="hidden" name="intent" value="message" />
          <DialogTitle>Написати повідомлення для {recipient}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              name="message"
              label="Ваше повідомлення"
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Скасувати</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Надсилання..." : "Надіслати"}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }

  function ReportDialog({ open, onClose, adTitle }) {
    const reasons = [
      "Шахрайство",
      "Некоректна інформація",
      "Образливий контент",
      "Спам",
      "Інше",
    ];

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Form method="post" onSubmit={() => onClose()}>
          <input type="hidden" name="intent" value="report" />
          <DialogTitle>Повідомити про порушення</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              Оголошення: {adTitle}
            </Typography>
            <TextField
              select
              fullWidth
              name="reason"
              label="Причина скарги"
              defaultValue=""
              margin="normal"
              required
            >
              {reasons.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              multiline
              rows={4}
              fullWidth
              name="details"
              label="Деталі порушення"
              variant="outlined"
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Скасувати</Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Надсилання..." : "Надіслати скаргу"}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }

  return (
    <>
      <Container className="content">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" gutterBottom>
              {ad.title}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Chip
                label={ad.category?.name || "Житло"}
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                label={ad.location}
                size="small"
                icon={<span className="material-icons">location_on</span>}
              />
            </Box>

            <ImageGallery photos={ad.photos} />

            <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
              <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                {ad.description}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Зручності та особливості
            </Typography>
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {ad.amenities?.map((amenity, index) => (
                <Grid key={index}>
                  <Chip
                    label={amenity}
                    icon={<span className="material-icons">check</span>}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="contact-card" elevation={0}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <div>
                    <Typography variant="subtitle1">
                      {ad.author ||
                        (ad.user
                          ? `${ad.user.firstName} ${ad.user.lastName}`
                          : "Анонім")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      На сайті з 2023 року
                    </Typography>
                  </div>
                </Box>

                <Divider sx={{ my: 2 }} />

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <span className="material-icons">phone</span>
                    </ListItemIcon>
                    <ListItemText
                      primary={ad.contact || ad.phone}
                      secondary="Телефон"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <span className="material-icons">email</span>
                    </ListItemIcon>
                    <ListItemText primary={ad.email} secondary="Email" />
                  </ListItem>
                </List>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<span className="material-icons">message</span>}
                  sx={{ mt: 2 }}
                  onClick={() => setMessageDialogOpen(true)}
                >
                  Написати повідомлення
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<span className="material-icons">report</span>}
                  sx={{ mt: 1 }}
                  onClick={() => setReportDialogOpen(true)}
                >
                  Повідомити про порушення
                </Button>
              </CardContent>
            </Card>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Опубліковано: {new Date(ad.createdAt).toLocaleDateString("uk-UA")}
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <MessageDialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        recipient={ad.author || (ad.user ? ad.user.firstName : "автора")}
      />

      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        adTitle={ad.title}
      />
    </>
  );
};
export default AdDetailPage;
