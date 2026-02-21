// React import not required with automatic JSX runtime
import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
} from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import customFetch from "../utils/customFetch"; // Assurez-vous d'importer votre utilitaire fetch

// Loader pour récupérer les catégories
export async function loader() {
  try {
    const response = await customFetch.get("/categories");
    return { data: response.data };
  } catch (error) {
    return {
      error:
        error.response?.data?.msg || "Erreur lors du chargement des catégories",
    };
  }
}

// Action pour gérer les opérations CRUD
export async function categoryAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const categoryId = formData.get("categoryId");
  const subcategoryId = formData.get("subcategoryId");
  const categoryName = formData.get("categoryName");

  try {
    switch (intent) {
      case "add-category":
        await customFetch.post("/categories", { name: categoryName });
        break;

      case "add-subcategory":
        await customFetch.post(`/categories/${categoryId}/sub-categories`, {
          name: categoryName,
        });
        break;

      case "edit-category":
        await customFetch.patch(`/categories/${categoryId}`, {
          name: categoryName,
        });
        break;

      case "edit-subcategory":
        await customFetch.patch(
          `/categories/${categoryId}/sub-categories/${subcategoryId}`,
          { name: categoryName }
        );
        break;

      case "delete-category":
        await customFetch.delete(`/categories/${categoryId}`);
        break;

      case "delete-subcategory":
        await customFetch.delete(
          `/categories/${categoryId}/sub-categories/${subcategoryId}`
        );
        break;

      default:
        throw new Error("Action non reconnue");
    }

    return { success: true };
  } catch (error) {
    return {
      error: error.response?.data?.msg || "Une erreur est survenue",
      intent,
    };
  }
}

import { useState } from "react";

function CategoryManager() {
  const { data, error } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleOpenDialog = (mode, category = null, subcategory = null) => {
    setDialogMode(mode);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  // Gestion des erreurs de chargement
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Form method="post">
      <main className="main-content">
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Управління категоріями</Typography>
          <Button
            variant="contained"
            startIcon={<span className="material-icons">add</span>}
            onClick={() => handleOpenDialog("add-category")}
          >
            Додати категорію
          </Button>
        </Box>

        {actionData?.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {actionData.error}
          </Alert>
        )}

        <Paper sx={{ p: "10px" }}>
          {data.map((category) => (
            <Box key={category.id}>
              <Box
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  borderRadius: "4px",
                  m: "4px 0",
                }}
              >
                <input type="hidden" name="categoryId" value={category.id} />
                <span className="material-icons" style={{ marginRight: "8px" }}>
                  folder
                </span>
                <Typography
                  variant="subtitle1"
                  className="category-name"
                  sx={{
                    flexGrow: 1,
                    cursor: "pointer",
                    borderRadius: "4px",
                    p: "2px 4px",
                  }}
                  onClick={() => handleOpenDialog("edit-category", category)}
                >
                  {category.name}
                </Typography>
                <Button
                  size="small"
                  startIcon={<span className="material-icons">add</span>}
                  onClick={() => handleOpenDialog("add-subcategory", category)}
                >
                  Додати підкатегорію
                </Button>
                <Button
                  type="submit"
                  name="intent"
                  value="delete-category"
                  sx={{ background: "none", border: "none", color: "red" }}
                  startIcon={<Delete />}
                ></Button>
              </Box>
              <Box component="div" sx={{ ml: 3 }}>
                {category.SubCategories.map((sub) => (
                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      borderRadius: "4px",
                      m: "4px 0",
                    }}
                    key={sub.id}
                  >
                    <input
                      type="hidden"
                      name="categoryId"
                      value={category.id}
                    />
                    <input type="hidden" name="subcategoryId" value={sub.id} />
                    <span
                      className="material-icons"
                      style={{ marginRight: "8px" }}
                    >
                      subdirectory_arrow_right
                    </span>
                    <Typography
                      variant="body1"
                      className="category-name"
                      onClick={() =>
                        handleOpenDialog("edit-subcategory", category, sub)
                      }
                      sx={{
                        flexGrow: 1,
                        cursor: "pointer",
                        p: "2px 4px",
                        borderRadius: "4px",
                      }}
                    >
                      {sub.name}
                    </Typography>
                    <Button
                      type="submit"
                      size="large"
                      name="intent"
                      value="delete-subcategory"
                      sx={{
                        background: "none",
                        border: "none",
                        color: "red",
                      }}
                      startIcon={<Delete />}
                    ></Button>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Paper>
      </main>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        component="form"
        method="post"
      >
        <DialogTitle>
          {dialogMode === "add-category"
            ? "Додати категорію"
            : dialogMode === "add-subcategory"
              ? "Додати підкатегорію"
              : "Змінити назву"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="categoryName"
            autoFocus
            margin="dense"
            label="Назва категорії"
            fullWidth
            variant="outlined"
            defaultValue={
              dialogMode === "edit-category"
                ? selectedCategory?.name
                : dialogMode === "edit-subcategory"
                  ? selectedSubcategory?.name
                  : ""
            }
          />
          {selectedCategory && (
            <input
              type="hidden"
              name="categoryId"
              value={selectedCategory.id}
            />
          )}
          {selectedSubcategory && (
            <input
              type="hidden"
              name="subcategoryId"
              value={selectedSubcategory.id}
            />
          )}
          <input type="hidden" name="intent" value={dialogMode} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Скасувати</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={navigation.state === "submitting"}
          >
            {dialogMode.startsWith("add") ? "Додати" : "Зберегти"}
          </Button>
        </DialogActions>
      </Dialog>
    </Form>
  );
}

export default CategoryManager;
