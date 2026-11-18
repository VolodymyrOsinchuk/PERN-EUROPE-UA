import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import customFetch, { apiUrl } from "../utils/customFetch";
import { toast } from "react-toastify";
import { GridView } from "../components";
import { useAuthContext } from "../context/AuthContext";

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
    </Container>
  );
}
