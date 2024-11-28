import React from "react";
import { useLoaderData, useSubmit } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const loader = async ({ params }) => {
  console.log("🚀 ~ loader ~  params:", params);
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
      return redirect("/categories");
    }
    toast.error(error?.response?.data?.msg || "Error loading data");
    return { category: null, subcategories: [] };
  }
};

const CategoryDetails = () => {
  const { category, subcategories } = useLoaderData();
  console.log("🚀 ~ CategoryDetails ~  subcategories:", subcategories);
  console.log("🚀 ~ CategoryDetails ~  category:", category);

  const submit = useSubmit();

  const handleDeleteSubcategory = (id) => {
    if (window.confirm("Delete this subcategory?")) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("_method", "DELETE");
      submit(formData, { method: "POST" });
    }
  };

  if (!category) {
    return <Typography>Category not found</Typography>;
  }

  return (
    <div>
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
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Add Subcategory
      </Button>

      <List>
        {subcategories.map((subcategory) => (
          <ListItem
            key={subcategory.id}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteSubcategory(subcategory.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={subcategory.name}
              secondary={subcategory.description}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CategoryDetails;
