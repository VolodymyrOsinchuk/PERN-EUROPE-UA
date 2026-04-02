import { useState } from "react";
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
  redirect,
} from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import customFetch from "../utils/customFetch";
import PageHeader from "./PageHeader";

export async function loader() {
  try {
    const response = await customFetch.get("/categories");
    return { data: response.data };
  } catch (error) {
    return { error: error.response?.data?.msg || "Помилка завантаження" };
  }
}

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
          { name: categoryName },
        );
        break;
      case "delete-category":
        await customFetch.delete(`/categories/${categoryId}`);
        break;
      case "delete-subcategory":
        await customFetch.delete(
          `/categories/${categoryId}/sub-categories/${subcategoryId}`,
        );
        break;
      default:
        throw new Error("Action inconnue");
    }
    return { success: true };
  } catch (error) {
    return {
      error: error.response?.data?.msg || "Une erreur est survenue",
      intent,
    };
  }
}

function CategoryManager() {
  const { data, error } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [expandedIds, setExpandedIds] = useState({});

  const handleOpenDialog = (mode, category = null, subcategory = null) => {
    setDialogMode(mode);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  const toggleExpand = (id) =>
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <PageHeader
        title="Категорії"
        subtitle={`${data?.length ?? 0} категорій`}
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Категорії" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog("add-category")}
          >
            Додати категорію
          </Button>
        }
      />

      {actionData?.error && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {actionData.error}
        </Alert>
      )}

      <Paper sx={{ overflow: "hidden" }}>
        {data?.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <span
              className="material-icons"
              style={{ fontSize: 40, color: "#CBD5E1" }}
            >
              category
            </span>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Категорій ще немає
            </Typography>
          </Box>
        )}

        {data?.map((category, idx) => (
          <Box
            key={category.id}
            sx={{
              borderBottom:
                idx < data.length - 1
                  ? "1px solid rgba(15,23,42,0.06)"
                  : "none",
            }}
          >
            {/* Category row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2.5,
                py: 1.5,
                gap: 1,
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              <IconButton
                size="small"
                onClick={() => toggleExpand(category.id)}
                sx={{
                  color: "#94A3B8",
                  transform: expandedIds[category.id]
                    ? "rotate(0deg)"
                    : "rotate(-90deg)",
                  transition: "transform 0.2s",
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>

              <FolderOutlinedIcon sx={{ color: "#F59E0B", fontSize: 20 }} />

              <Typography variant="body2" fontWeight={600} sx={{ flexGrow: 1 }}>
                {category.name}
              </Typography>

              <Chip
                label={`${category.SubCategories?.length ?? 0} підкат.`}
                size="small"
                sx={{
                  bgcolor: "#F1F5F9",
                  color: "#64748B",
                  fontSize: "0.7rem",
                }}
              />

              <Tooltip title="Додати підкатегорію">
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog("add-subcategory", category)}
                >
                  <AddIcon fontSize="small" sx={{ color: "#2563EB" }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Редагувати">
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog("edit-category", category)}
                >
                  <EditOutlinedIcon
                    fontSize="small"
                    sx={{ color: "#64748B" }}
                  />
                </IconButton>
              </Tooltip>

              <Form method="post" style={{ display: "inline" }}>
                <input type="hidden" name="categoryId" value={category.id} />
                <Tooltip title="Видалити категорію">
                  <IconButton
                    size="small"
                    type="submit"
                    name="intent"
                    value="delete-category"
                  >
                    <DeleteOutlineIcon
                      fontSize="small"
                      sx={{ color: "#EF4444" }}
                    />
                  </IconButton>
                </Tooltip>
              </Form>
            </Box>

            {/* Subcategories */}
            <Collapse in={expandedIds[category.id] ?? true}>
              {category.SubCategories?.map((sub) => (
                <Box
                  key={sub.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2.5,
                    pl: 6.5,
                    py: 1.2,
                    gap: 1,
                    bgcolor: "#FAFAFA",
                    borderTop: "1px solid rgba(15,23,42,0.04)",
                    "&:hover": { bgcolor: "#F1F5F9" },
                  }}
                >
                  <SubdirectoryArrowRightIcon
                    sx={{ fontSize: 16, color: "#CBD5E1" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, color: "#334155" }}
                  >
                    {sub.name}
                  </Typography>

                  <Tooltip title="Редагувати підкатегорію">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleOpenDialog("edit-subcategory", category, sub)
                      }
                    >
                      <EditOutlinedIcon
                        fontSize="small"
                        sx={{ color: "#64748B" }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Form method="post" style={{ display: "inline" }}>
                    <input
                      type="hidden"
                      name="categoryId"
                      value={category.id}
                    />
                    <input type="hidden" name="subcategoryId" value={sub.id} />
                    <Tooltip title="Видалити підкатегорію">
                      <IconButton
                        size="small"
                        type="submit"
                        name="intent"
                        value="delete-subcategory"
                      >
                        <DeleteOutlineIcon
                          fontSize="small"
                          sx={{ color: "#EF4444" }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Form>
                </Box>
              ))}
            </Collapse>
          </Box>
        ))}
      </Paper>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add-category" && "Нова категорія"}
          {dialogMode === "add-subcategory" &&
            `Підкатегорія → ${selectedCategory?.name}`}
          {(dialogMode === "edit-category" ||
            dialogMode === "edit-subcategory") &&
            "Редагувати назву"}
        </DialogTitle>
        <Form method="post">
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              name="categoryName"
              autoFocus
              label="Назва"
              fullWidth
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
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              color="inherit"
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={navigation.state === "submitting"}
            >
              {dialogMode?.startsWith("add") ? "Додати" : "Зберегти"}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </Box>
  );
}

export default CategoryManager;
