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
import { ImageGallery } from "../components";
import "../assets/css/adDetailPage.css";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router-dom";
const apiUrl = import.meta.env.VITE_APP_API_URL;

export const loader = async ({ params }) => {
  console.log("🚀 ~ loader ~  params:", params);
  try {
    const { data } = await customFetch.get(`/adv/${params.id}`);

    // console.log("🚀 ~ loader ~ data :", data);
    return data;
  } catch (error) {
    console.log("🚀 ~ loader ~ error:", error);
    toast.error(error?.response.data?.msg);
    return error;
  }
};

const AdDetailPage = () => {
  const ad = useLoaderData();
  console.log("🚀 ~ AdDetailPage ~  ad :", ad);
  // let serverPath = ad.photos;
  // const clientPath = serverPath.replace("public", "");
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  function MessageDialog({ open, onClose, recipient }) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Sending message:", message);
      setMessage("");
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Написати повідомлення для {recipient}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              label="Ваше повідомлення"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Скасувати</Button>
            <Button type="submit" variant="contained">
              Надіслати
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  function ReportDialog({ open, onClose, adTitle }) {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");

    const reasons = [
      "Шахрайство",
      "Некоректна інформація",
      "Образливий контент",
      "Спам",
      "Інше",
    ];

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Sending report:", { reason, details });
      setReason("");
      setDetails("");
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Повідомити про порушення</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              Оголошення: {adTitle}
            </Typography>
            <TextField
              select
              fullWidth
              label="Причина скарги"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
              autoFocus
              multiline
              rows={4}
              fullWidth
              label="Деталі порушення"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              variant="outlined"
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Скасувати</Button>
            <Button type="submit" variant="contained" color="error">
              Надіслати скаргу
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  // const ad = {
  //   id: 1,
  //   title: "Здам кімнату в Берліні",
  //   category: "housing",
  //   location: "Берлін, Німеччина",
  //   date: "2023-08-15",
  //   description:
  //     "Затишна кімната в районі Мітте, поруч метро. Повністю мебльована, з доступом до спільної кухні та ванної кімнати. У квартирі є все необхідне для комфортного проживання: пральна машина, посудомийна машина, Wi-Fi. Поруч знаходяться супермаркети, кафе, restaurants та парк. Відмінне транспортне сполучення - 5 хвилин пішки до метро.\n\nУмови:\n- Ціна: 500€/місяць\n- Застава: 1000€\n- Мінімальний термін оренди: 6 місяців\n- Доступно з: 1 вересня 2023\n- Комунальні послуги включені у вартість",
  //   author: "Марія К.",
  //   contact: "+49 123 456 789",
  //   email: "maria.k@example.com",
  //   photos: [
  //     "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  //     "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  //     "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  //     "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  //   ],
  //   amenities: [
  //     "Wi-Fi",
  //     "Меблі",
  //     "Пральна машина",
  //     "Посудомийна машина",
  //     "Балкон",
  //     "Ліфт",
  //   ],
  // };
  return (
    <>
      <Container className="content">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" gutterBottom>
              {ad.title}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Chip label="Житло" color="primary" size="small" sx={{ mr: 1 }} />
              <Chip
                label={ad.location}
                size="small"
                icon={<span className="material-icons">location_on</span>}
              />
            </Box>

            <ImageGallery photos={ad.photos} />

            <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
              <Typography
                variant="body1"
                // paragraph
                style={{ whiteSpace: "pre-line" }}
              >
                {ad.description}
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Зручності та особливості
            </Typography>
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {ad.amenities.map((amenity, index) => (
                <Grid key={index}>
                  <Chip
                    label={amenity}
                    icon={<span className="material-icons">check</span>}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>

            {/* <Paper elevation={1} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
                Розташування
              </Typography>
              <div className="map-container">
                <LocationMap address={`${ad.location}`} />
              </div>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <span
                    className="material-icons"
                    style={{
                      fontSize: "small",
                      verticalAlign: "middle",
                      marginRight: 1,
                    }}
                  >
                    location_on
                  </span>
                  {ad.location}
                </Typography>
              </Box>
            </Paper> */}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="contact-card" elevation={0}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {/* <Avatar sx={{ mr: 2 }}>{ad.author[0]}</Avatar> */}
                  <div>
                    <Typography variant="subtitle1">{ad.author}</Typography>
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
                    <ListItemText primary={ad.contact} secondary="Телефон" />
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
        recipient={ad.author}
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
