import React, { useState } from "react";
import { Typography } from "@mui/material";

// import Sidebar from "../components/Sidebar";
import CategoryForm from "../components/CategoryForm";
import CategoryItem from "../components/CategoryItem";
import CategoryDialog from "../components/CategoryDialog";

function CategoryManager() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Робота", subcategories: ["IT", "Медицина", "Освіта"] },
    {
      id: 2,
      name: "Житло",
      subcategories: ["Оренда", "Продаж", "Пошук співмешканців"],
    },
    {
      id: 3,
      name: "Послуги",
      subcategories: ["Переклади", "Юридичні послуги", "Медичні послуги"],
    },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: categories.length + 1,
        name: newCategoryName,
        subcategories: [],
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
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

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleDeleteSubcategory = (categoryId, subcategoryIndex) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.filter(
              (_, index) => index !== subcategoryIndex
            ),
          };
        }
        return category;
      })
    );
  };

  return (
    <div style={{ display: "flex" }}>
      {/* <Sidebar /> */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Менеджер категорій
        </Typography>
        <CategoryForm
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          handleAddCategory={handleAddCategory}
        />
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
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
          onClose={() => setOpenDialog(false)}
          onAddSubcategory={handleAddSubcategory}
          newSubcategoryName={newSubcategoryName}
          setNewSubcategoryName={setNewSubcategoryName}
        />
      </main>
    </div>
  );
}

export default CategoryManager;
