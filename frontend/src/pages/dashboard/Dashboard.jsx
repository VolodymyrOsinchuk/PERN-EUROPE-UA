import { useLoaderData } from "react-router-dom";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import customFetch from "../../utils/customFetch";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users/stats");
    return data;
  } catch (error) {
    return { users: 0, ads: 0, categories: 0 };
  }
};

const stats = [
  {
    key: "users",
    label: "Користувачі",
    icon: "people_alt",
    color: "#2563EB",
    bg: "#EFF6FF",
    trend: "+12%",
    trendUp: true,
  },
  {
    key: "ads",
    label: "Оголошення",
    icon: "article",
    color: "#10B981",
    bg: "#ECFDF5",
    trend: "+8%",
    trendUp: true,
  },
  {
    key: "categories",
    label: "Категорії",
    icon: "category",
    color: "#F59E0B",
    bg: "#FFF7ED",
    trend: "0%",
    trendUp: null,
  },
];

const StatCard = ({ label, value, icon, color, bg, trend, trendUp }) => (
  <Paper
    sx={{
      p: 2.5,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      transition: "transform 0.2s",
      "&:hover": { transform: "translateY(-2px)" },
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mt: 0.5, letterSpacing: "-0.03em" }}
        >
          {value ?? "—"}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="material-icons" style={{ color, fontSize: 22 }}>
          {icon}
        </span>
      </Box>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <span
        className="material-icons"
        style={{
          fontSize: 14,
          color: trendUp === null ? "#94A3B8" : trendUp ? "#10B981" : "#EF4444",
        }}
      >
        {trendUp === null
          ? "remove"
          : trendUp
            ? "trending_up"
            : "trending_down"}
      </span>
      <Typography
        variant="caption"
        sx={{
          color: trendUp === null ? "#94A3B8" : trendUp ? "#10B981" : "#EF4444",
          fontWeight: 600,
        }}
      >
        {trend} за місяць
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const data = useLoaderData();

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Огляд
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ласкаво просимо до панелі адміністратора. Ось загальна статистика.
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((s) => {
          const { key, ...props } = s;
          return (
            <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard {...props} value={data?.[key]} />
            </Grid>
          );
        })}
      </Grid>

      {/* Placeholder for charts / activity feed */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Активність
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                height: 220,
                bgcolor: "#F8FAFC",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed rgba(15,23,42,0.12)",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Графік активності (підключіть Recharts)
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Останні дії
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {[
              {
                icon: "person_add",
                text: "Новий користувач зареєстровано",
                time: "2хв тому",
                color: "#2563EB",
                bg: "#EFF6FF",
              },
              {
                icon: "post_add",
                text: "Нове оголошення опубліковано",
                time: "15хв тому",
                color: "#10B981",
                bg: "#ECFDF5",
              },
              {
                icon: "delete_outline",
                text: "Оголошення видалено",
                time: "1год тому",
                color: "#EF4444",
                bg: "#FEF2F2",
              },
            ].map((item, i) => {
              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      bgcolor: item.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-icons"
                      style={{ color: item.color, fontSize: 17 }}
                    >
                      {item.icon}
                    </span>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ lineHeight: 1.3 }}
                    >
                      {item.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.time}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
