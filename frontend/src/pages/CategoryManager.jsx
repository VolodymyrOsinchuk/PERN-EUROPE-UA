import React, { useState } from "react";
import {
  // useParams,
  // useNavigate,
  // useNavigation,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { Typography, Box } from "@mui/material";

// import Sidebar from "../components/Sidebar";
import CategoryForm from "../components/CategoryForm"; //OK
import CategoryItem from "../components/CategoryItem";
import CategoryDialog from "../components/CategoryDialog";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const dataForm = Object.fromEntries(formData);

  try {
    // First POST request
    const response1 = await customFetch.post("/categories", dataForm);
    // console.log("🚀 ~ action ~ response1:", response1);

    // Notify success for the first request
    toast.success("Категорія успішно створена");
    return redirect(`/dashboard/categories`);
  } catch (error) {
    console.log("🚀 ~ action ~ error:", error);
    toast.error(error?.response?.data?.msg || "An error occurred");
    return error;
  }
};

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/categories`);
    return data;
  } catch (error) {
    console.log("🚀 ~ loader ~ error:", error);
    toast.error(error?.response.data?.msg);
    return error;
  }
};

function CategoryManager() {
  const data = useLoaderData();
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState(null);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [isSubcategory, setIsSubcategory] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [editMode, setEditMode] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);
  const [editingSubcategory, setEditingSubcategory] = React.useState(null);
  const [urlCategoryId, setUrlCategoryId] = React.useState(null);
  // console.log("window.location.pathname", window.location.pathname);
  React.useEffect(() => {
    const path = window.location.pathname;

    // Handle /edit route
    if (path === "/edit") {
      // Show all categories in edit mode
      return;
    }

    // Existing code for specific category edit
    const match = path.match(/\/edit\/(\d+)/);
    if (match) {
      const categoryId = parseInt(match[1]);
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) {
        startEdit(category);
        setUrlCategoryId(categoryId);
      }
    }
  }, []);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") {
      setAlertMessage("Назва категорії не може бути порожньою");
      return;
    }

    if (isSubcategory && selectedCategory) {
      const updatedCategories = categories.map((cat) => {
        if (cat.id === selectedCategory.id) {
          return {
            ...cat,
            subcategories: [
              ...cat.subcategories,
              {
                id: Date.now(),
                name: newCategoryName,
              },
            ],
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
    } else {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          name: newCategoryName,
          subcategories: [],
        },
      ]);
    }

    setNewCategoryName("");
    setOpenDialog(false);
    setSelectedCategory(null);
    setIsSubcategory(false);
    setAlertMessage("Категорію успішно додано");
  };

  const handleDeleteCategory = (categoryId, subcategoryId = null) => {
    if (subcategoryId) {
      const updatedCategories = categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(
              (sub) => sub.id !== subcategoryId
            ),
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
    } else {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
    setAlertMessage("Категорію успішно видалено");
  };

  const handleEditCategory = () => {
    if (newCategoryName.trim() === "") {
      setAlertMessage("Назва категорії не може бути порожньою");
      return;
    }

    const updatedCategories = categories.map((cat) => {
      if (editingSubcategory) {
        if (cat.id === editingCategory.id) {
          return {
            ...cat,
            subcategories: cat.subcategories.map((sub) =>
              sub.id === editingSubcategory.id
                ? { ...sub, name: newCategoryName }
                : sub
            ),
          };
        }
      } else if (cat.id === editingCategory.id) {
        return { ...cat, name: newCategoryName };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setNewCategoryName("");
    setOpenDialog(false);
    setEditMode(false);
    setEditingCategory(null);
    setEditingSubcategory(null);
    setAlertMessage("Назву успішно змінено");

    if (urlCategoryId) {
      window.history.pushState({}, "", "/");
      setUrlCategoryId(null);
    }
  };

  const startEdit = (category, subcategory = null) => {
    setEditMode(true);
    setEditingCategory(category);
    setEditingSubcategory(subcategory);
    setNewCategoryName(subcategory ? subcategory.name : category.name);
    setOpenDialog(true);

    if (!subcategory) {
      window.history.pushState({}, "", `/edit/${category.id}`);
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && selectedCategory) {
      setCategories(
        categories.map((category) => {
          if (category.id === selectedCategory.id) {
            return {
              ...category,
              subcategories: [...category.subcategories, newSubcategoryName],
            };
          }
          return category;
        })
      );
      setNewSubcategoryName("");
      setOpenDialog(false);
    }
  };

  const handleDeleteSubcategory = (categoryId, subcategoryIndex) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            SubCategories: category.subcategories.filter(
              (_, index) => index !== subcategoryIndex
            ),
          };
        }
        return category;
      })
    );
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        mb: 4,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Менеджер категорій
        </Typography>
        <CategoryForm newCategoryName="name" />
        {data.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            categories={data}
            onAddSubcategory={(selectedCategory) => {
              setSelectedCategory(selectedCategory);
              setOpenDialog(true);
            }}
            onDeleteCategory={handleDeleteCategory}
            onDeleteSubcategory={handleDeleteSubcategory}
          />
        ))}
        <CategoryDialog
          open={openDialog}
          // onClose={
          //   setOpenDialog(false)
          //   setEditMode(false),
          //   setNewCategoryName("")
          // }
          onClose={() => {
            console.log("onClose");
          }}
          newSubcategoryName={newSubcategoryName}
          onAddSubcategory={handleAddSubcategory}
          setNewSubcategoryName={setNewSubcategoryName}
        />
      </Box>
    </Box>
  );
}

export default CategoryManager;
