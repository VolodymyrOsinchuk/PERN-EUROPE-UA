import { useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { PageHeader } from "../../components";

export default function Settings() {
  const [siteTitle, setSiteTitle] = useState("PERN EUROPE UA");
  const [supportEmail, setSupportEmail] = useState("support@example.com");

  const handleSave = () => {
    // Placeholder: persist settings to backend if needed
    alert("Налаштування збережено (заглушка)");
  };

  return (
    <Container>
      <PageHeader title="Налаштування" breadcrumbs={[{ label: "Панель", to: "/dashboard" }, { label: "Налаштування" }]} />
      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Загальні</Typography>
        <TextField label="Назва сайту" fullWidth value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} sx={{ mb: 2 }} />
        <TextField label="Підтримка (email)" fullWidth value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={handleSave}>Зберегти</Button>
          <Button variant="outlined" href="/dashboard">Скасувати</Button>
        </Box>
      </Box>
    </Container>
  );
}