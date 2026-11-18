import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { GridView } from "../../components";

export default function ViewHistory() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    customFetch
      .get("/trust/view-history")
      .then(({ data }) => {
        if (!cancelled) setAds(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Нещодавно переглянуті
      </Typography>
      {ads.length ? (
        <GridView ads={ads} />
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary" mb={2}>
            Тут з’являться оголошення, які ви переглянули.
          </Typography>
          <Button component={Link} to="/ads" variant="contained">
            Переглянути оголошення
          </Button>
        </Box>
      )}
    </Box>
  );
}
