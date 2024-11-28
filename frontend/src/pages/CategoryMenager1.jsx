// src/components/CategoryManager.js
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CategoryItem from "../components/CategoryItem";
import CategoryDialog from "../components/CategoryDialog";
import { Box, Button, Alert, Typography } from "@mui/material";

const CategoryManager = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Робота",
      subcategories: [
        { id: 11, name: "IT" },
        { id: 12, name: "Медицина" },
      ],
    },
    {
      id: 2,
      name: "Житло",
      subcategories: [
        { id: 21, name: "Оренда" },
        { id: 22, name: "Продаж" },
      ],
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddCategory = () => {
    if (categoryName.trim() === "") {
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
                name: categoryName,
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
          name: categoryName,
          subcategories: [],
        },
      ]);
    }

    setCategoryName("");
    setOpenDialog(false);
    setAlertMessage("Категорію успішно додано");
  };

  const handleEditCategory = () => {
    if (categoryName.trim() === "") {
      setAlertMessage("Назва категорії не може бути порожньою");
      return;
    }

    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedCategory.id) {
        return { ...cat, name: categoryName };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setCategoryName("");
    setOpenDialog(false);
    setIsEditMode(false);
    setAlertMessage("Назву успішно змінено");
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
    setAlertMessage("Категорію успішно видалено");
  };

  return (
    <React.Fragment>
      <Box sx={{ ml: 30, p: 3 }}>
        <Typography variant="h4">Управління категоріями</Typography>

        {alertMessage && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setAlertMessage("")}
          >
            {alertMessage}
          </Alert>
        )}

        <CategoryItem
          categories={categories}
          onEditCategory={(category) => {
            setSelectedCategory(category);
            setCategoryName(category.name);
            setIsEditMode(true);
            setOpenDialog(true);
          }}
          onDeleteCategory={handleDeleteCategory}
          onAddSubCategory={(category) => {
            setSelectedCategory(category);
            setCategoryName("");
            setIsSubcategory(true);
            setOpenDialog(true);
          }}
        />

        <Button
          variant="contained"
          onClick={() => {
            setIsSubcategory(false);
            setOpenDialog(true);
            setCategoryName("");
          }}
        >
          Додати категорію
        </Button>
      </Box>

      <CategoryDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={isEditMode ? handleEditCategory : handleAddCategory}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        isEditMode={isEditMode}
        isSubcategory={isSubcategory}
      />
    </React.Fragment>
  );
};

export default CategoryManager;
