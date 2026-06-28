import { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useLoaderData, Form, useNavigation } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { PageHeader } from "../../components";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/admin/settings");
    return data;
  } catch {
    return { siteTitle: "PERN EUROPE UA", supportEmail: "support@example.com" };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  try {
    const siteTitle = formData.get("siteTitle");
    const supportEmail = formData.get("supportEmail");
    await customFetch.put("/admin/settings", { siteTitle, supportEmail });
    toast.success("Налаштування збережено");
    return { ok: true };
  } catch (error) {
    toast.error(error?.response?.data?.error || "Помилка збереження");
    return { ok: false };
  }
};

export default function Settings() {
  const initial = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Container>
      <PageHeader
        title="Налаштування"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Налаштування" },
        ]}
      />
      <Form method="post">
        <Box sx={{ maxWidth: 600 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Загальні</Typography>
          <TextField
            label="Назва сайту"
            name="siteTitle"
            fullWidth
            defaultValue={initial.siteTitle}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Підтримка (email)"
            name="supportEmail"
            fullWidth
            defaultValue={initial.supportEmail}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </Button>
            <Button variant="outlined" href="/dashboard">Скасувати</Button>
          </Box>
        </Box>
      </Form>
    </Container>
  );
}
