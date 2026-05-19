import { useLoaderData, Form, redirect } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/users/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка завантаження користувача");
    return null;
  }
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  try {
    await customFetch.put(`/users/${params.id}`, payload);
    toast.success("Користувача оновлено");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка оновлення");
  }
  return redirect("/dashboard/users");
}

export default function EditUser() {
  const user = useLoaderData();
  if (!user) return <Container><Typography>Користувача не знайдено</Typography></Container>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mb: 2 }}>Редагувати користувача</Typography>
      <Form method="post">
        <input type="hidden" name="id" value={user.id} />
        <TextField name="firstName" label="Ім'я" defaultValue={user.firstName} fullWidth sx={{ mb: 2 }} />
        <TextField name="lastName" label="Прізвище" defaultValue={user.lastName} fullWidth sx={{ mb: 2 }} />
        <TextField name="email" label="Email" type="email" defaultValue={user.email} fullWidth sx={{ mb: 2 }} />
        <TextField name="phoneNumber" label="Телефон" defaultValue={user.phoneNumber} fullWidth sx={{ mb: 2 }} />
        <Button type="submit" variant="contained">Зберегти</Button>
      </Form>
    </Container>
  );
}
