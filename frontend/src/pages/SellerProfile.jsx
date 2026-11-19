import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import customFetch, { apiUrl } from "../utils/customFetch";
import { toast } from "react-toastify";
import { GridView } from "../components";
import { useAuthContext } from "../context/AuthContext";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";

const REPORT_USER_REASONS = [
  "Шахрайство",
  "Некоректна поведінка",
  "Спам",
  "Образливий контент",
  "Інше",
];

function ReportUserDialog({ open, onClose, userId, userName }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Оберіть причину скарги");
      return;
    }
    setSubmitting(true);
    try {
      await customFetch.post("/reports", {
        reportedUserId: userId,
        reason,
        details: details || null,
      });
      toast.success("Скаргу надіслано на модерацію");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Не вдалося надіслати скаргу",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
    >
      <form onSubmit={submit}>
        <DialogTitle
          sx={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "1.3rem",
            pb: 1,
          }}
        >
          Пожаловатися на користувача
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              bgcolor: "#fef2f2",
              border: "1px solid #fecaca",
              mb: 2.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.82rem",
                color: "#991b1b",
                fontWeight: 600,
              }}
            >
              Користувач: {userName}
            </Typography>
          </Box>
          <FormControl fullWidth>
            <InputLabel>Причина скарги</InputLabel>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              label="Причина скарги"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                },
              }}
            >
              <MenuItem value="">Оберіть причину</MenuItem>
              {REPORT_USER_REASONS.map((r) => (
                <MenuItem key={r} value={r} sx={{ fontSize: "0.875rem" }}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            multiline
            rows={4}
            fullWidth
            name="details"
            label="Деталі порушення"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            margin="normal"
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={onClose}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              color: "#64748b",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={submitting}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
            }}
          >
            {submitting ? "Надсилання..." : "Надіслати скаргу"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/adv/seller/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Не вдалося завантажити продавця");
    throw new Response("Not found", { status: 404 });
  }
}

export default function SellerProfile() {
  const { seller, ads } = useLoaderData();
  const { user } = useAuthContext();
  const [reviewData, setReviewData] = useState({
    average: null,
    count: 0,
    reviews: [],
  });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    customFetch
      .get(`/seller-reviews/${seller.id}`)
      .then(({ data }) => {
        if (!cancelled) setReviewData(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [seller.id]);

  const submitReview = async () => {
    if (!rating) {
      toast.error("Оберіть оцінку");
      return;
    }
    setSaving(true);
    try {
      await customFetch.put(`/seller-reviews/${seller.id}`, {
        rating,
        comment,
      });
      const { data } = await customFetch.get(`/seller-reviews/${seller.id}`);
      setReviewData(data);
      toast.success("Відгук збережено");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Не вдалося зберегти відгук");
    } finally {
      setSaving(false);
    }
  };

  const name = `${seller.firstName || ""} ${seller.lastName || ""}`.trim();
  const picture = seller.profilePicture
    ? seller.profilePicture.startsWith("http")
      ? seller.profilePicture
      : `${apiUrl}${seller.profilePicture}`
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: "20px", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={picture} sx={{ width: 72, height: 72 }}>
            {name.slice(0, 2).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {name || "Продавець"}
            </Typography>
            <Typography color="text.secondary">
              {[seller.city, seller.country].filter(Boolean).join(", ") || "Локація не вказана"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              На платформі з{" "}
              {seller.createdAt
                ? new Date(seller.createdAt).toLocaleDateString("uk-UA")
                : "невідомої дати"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Rating
            value={reviewData.average || 0}
            precision={0.1}
            readOnly
          />
          <Typography variant="body2" color="text.secondary">
            {reviewData.count
              ? `${Number(reviewData.average).toFixed(1)} (${reviewData.count})`
              : "Поки немає відгуків"}
          </Typography>
        </Box>
      </Paper>

      {user && user.id !== seller.id && (
        <Paper sx={{ p: 3, borderRadius: "16px", mb: 4 }}>
          <Typography variant="h6" fontWeight={800} mb={1.5}>
            Залишити відгук про продавця
          </Typography>
          <Rating value={rating} onChange={(_, value) => setRating(value || 0)} />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Коментар (необов'язково)"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Button variant="contained" onClick={submitReview} disabled={saving}>
            {saving ? "Збереження..." : "Зберегти відгук"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReportOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => setReportOpen(true)}
            sx={{
              color: "#ef4444",
              borderColor: "#ef4444",
              fontWeight: 600,
              textTransform: "none",
              marginLeft: 1,
              "&:hover": { bgcolor: "#fef2f2" },
            }}
          >
            Пожаловатися на користувача
          </Button>
        </Paper>
      )}

      <Typography variant="h6" fontWeight={800} mb={2}>
        Активні оголошення
      </Typography>
      {ads.length ? (
        <GridView ads={ads} />
      ) : (
        <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
          У продавця немає активних оголошень.
        </Paper>
      )}

      <ReportUserDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        userId={seller.id}
        userName={name}
      />
    </Container>
  );
}
