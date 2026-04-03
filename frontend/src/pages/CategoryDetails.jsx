import {
  useLoaderData,
  useSubmit,
  Form,
  redirect,
  useNavigation,
} from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useState } from "react";

export const loader = async ({ params }) => {
  try {
    const [categoryRes, subcategoriesRes] = await Promise.all([
      customFetch.get(`/categories/${params.id}`),
      customFetch.get(`/categories/${params.id}/sub-categories`),
    ]);

    return {
      category: categoryRes.data,
      subcategories: subcategoriesRes.data,
    };
  } catch (error) {
    console.error("🚀 ~ loader ~ error:", error);
    if (error.response?.status === 404) {
      toast.error("Категорію не знайдено");
      return redirect("/dashboard/categories");
    }
    toast.error(error?.response?.data?.message || "Помилка завантаження даних");
    return { category: null, subcategories: [] };
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const subcategoryId = formData.get("subcategoryId");
  const name = formData.get("name");
  const description = formData.get("description");

  try {
    if (intent === "delete-subcategory") {
      await customFetch.delete(
        `/categories/${params.id}/sub-categories/${subcategoryId}`,
      );
      toast.success("Підкатегорію видалено");
    } else if (intent === "add-subcategory") {
      await customFetch.post(`/categories/${params.id}/sub-categories`, {
        name,
        description,
      });
      toast.success("Підкатегорію додано");
    } else if (intent === "edit-subcategory") {
      await customFetch.put(
        `/categories/${params.id}/sub-categories/${subcategoryId}`,
        { name, description },
      );
      toast.success("Підкатегорію оновлено");
    }
    return { success: true };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Дія не виконана");
    return { error: error?.response?.data?.message || "Дія не виконана" };
  }
};

const CategoryDetails = () => {
  const { category, subcategories } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // add or edit
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleOpenAdd = () => {
    setDialogMode("add");
    setSelectedSubcategory(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (sub) => {
    setDialogMode("edit");
    setSelectedSubcategory(sub);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteSubcategory = (id) => {
    if (window.confirm("Видалити цю підкатегорію?")) {
      const formData = new FormData();
      formData.append("subcategoryId", id);
      formData.append("intent", "delete-subcategory");
      submit(formData, { method: "POST" });
    }
  };

  if (!category) {
    return <Typography>Категорію не знайдено</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {category.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {category.description}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenAdd}
        sx={{ mb: 2 }}
      >
        Додати підкатегорію
      </Button>

      <List>
        {subcategories.map((subcategory) => (
          <ListItem
            key={subcategory.id}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  sx={{ mr: 1 }}
                  onClick={() => handleOpenEdit(subcategory)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteSubcategory(subcategory.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={subcategory.name}
              secondary={subcategory.description}
            />
          </ListItem>
        ))}
      </List>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Form method="post" onSubmit={() => handleCloseDialog()}>
          <DialogTitle>
            {dialogMode === "add"
              ? "Додати підкатегорію"
              : "Редагувати підкатегорію"}
          </DialogTitle>
          <DialogContent>
            <input
              type="hidden"
              name="intent"
              value={
                dialogMode === "add" ? "add-subcategory" : "edit-subcategory"
              }
            />
            {selectedSubcategory && (
              <input
                type="hidden"
                name="subcategoryId"
                value={selectedSubcategory.id}
              />
            )}
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Назва"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedSubcategory?.name || ""}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Опис"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              defaultValue={selectedSubcategory?.description || ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Скасувати</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={navigation.state === "submitting"}
            >
              {dialogMode === "add" ? "Додати" : "Зберегти"}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </Box>
  );
};

export default CategoryDetails;
