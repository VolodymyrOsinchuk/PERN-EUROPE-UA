import { useLoaderData } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import customFetch from "../utils/customFetch";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export async function loader() {
  try {
    const { data } = await customFetch.get("/users/stats");
    return data;
  } catch (error) {
    return { users: 0, ads: 0, categories: 0 };
  }
}

export default function Stats() {
  const stats = useLoaderData() || { users: 0, ads: 0, categories: 0 };
  const barData = [
    { name: "Users", value: stats.users },
    { name: "Ads", value: stats.ads },
    { name: "Categories", value: stats.categories },
  ];

  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Ads", value: stats.ads },
    { name: "Categories", value: stats.categories },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Статистика</Typography>
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Box sx={{ width: 400, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0057B8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ width: 300, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Container>
  );
}
