// // src/components/CategoryManager.js
// import React, { useState, useEffect } from "react";
// import { Box, Typography, Button, Paper } from "@mui/material";
// import CategoryItem from "../components/CategoryItem1";
// import SubcategoryItem from "../components/SubcategoryItem1";
// import CategoryDialog from "../components/CategoryDialog1";
// import { Alert } from "@mui/material";

// const CategoryManager = () => {
//   const [categories, setCategories] = useState([
//     {
//       id: 1,
//       name: "Робота",
//       subcategories: [
//         { id: 11, name: "IT" },
//         { id: 12, name: "Медицина" },
//       ],
//     },
//     {
//       id: 2,
//       name: "Житло",
//       subcategories: [
//         { id: 21, name: "Оренда" },
//         { id: 22, name: "Продаж" },
//       ],
//     },
//   ]);

//   const [openDialog, setOpenDialog] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isSubcategory, setIsSubcategory] = useState(false);
//   // const [alertMessage, setAlertMessage] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [editingSubcategory, setEditingSubcategory] = useState(null);

//   const handleAddCategory = () => {
//     if (newCategoryName.trim() === "") {
//       // setAlertMessage("Назва категорії не може бути порожньою");
//       return;
//     }

//     if (isSubcategory && selectedCategory) {
//       const updatedCategories = categories.map((cat) => {
//         if (cat.id === selectedCategory.id) {
//           return {
//             ...cat,
//             subcategories: [
//               ...cat.subcategories,
//               {
//                 id: Date.now(),
//                 name: newCategoryName,
//               },
//             ],
//           };
//         }
//         return cat;
//       });
//       setCategories(updatedCategories);
//     } else {
//       setCategories([
//         ...categories,
//         {
//           id: Date.now(),
//           name: newCategoryName,
//           subcategories: [],
//         },
//       ]);
//     }

//     setNewCategoryName("");
//     setOpenDialog(false);
//     setSelectedCategory(null);
//     setIsSubcategory(false);
//     // setAlertMessage("Категорію успішно додано");
//   };

//   const handleDeleteCategory = (categoryId, subcategoryId = null) => {
//     if (subcategoryId) {
//       const updatedCategories = categories.map((cat) => {
//         if (cat.id === categoryId) {
//           return {
//             ...cat,
//             subcategories: cat.subcategories.filter(
//               (sub) => sub.id !== subcategoryId
//             ),
//           };
//         }
//         return cat;
//       });
//       setCategories(updatedCategories);
//     } else {
//       setCategories(categories.filter((cat) => cat.id !== categoryId));
//     }
//     // setAlertMessage("Категорію успішно видалено");
//   };

//   const handleEditCategory = () => {
//     if (newCategoryName.trim() === "") {
//       // setAlertMessage("Назва категорії не може бути порожньою");
//       return;
//     }

//     const updatedCategories = categories.map((cat) => {
//       if (editingSubcategory) {
//         if (cat.id === editingCategory.id) {
//           return {
//             ...cat,
//             subcategories: cat.subcategories.map((sub) =>
//               sub.id === editingSubcategory.id
//                 ? { ...sub, name: newCategoryName }
//                 : sub
//             ),
//           };
//         }
//       } else if (cat.id === editingCategory.id) {
//         return { ...cat, name: newCategoryName };
//       }
//       return cat;
//     });

//     setCategories(updatedCategories);
//     setNewCategoryName("");
//     setOpenDialog(false);
//     setEditMode(false);
//     setEditingCategory(null);
//     setEditingSubcategory(null);
//     // setAlertMessage("Назву успішно змінено");
//   };

//   const startEdit = (category, subcategory = null) => {
//     setEditMode(true);
//     setEditingCategory(category);
//     setEditingSubcategory(subcategory);
//     setNewCategoryName(subcategory ? subcategory.name : category.name);
//     setOpenDialog(true);
//   };

//   return (
//     <React.Fragment>
//       <main className="main-content">
//         <Box
//           sx={{
//             mb: 4,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h4">Управління категоріями</Typography>
//           <Button
//             variant="contained"
//             startIcon={<span className="material-icons">add</span>}
//             onClick={() => {
//               setEditMode(false);
//               setIsSubcategory(false);
//               setOpenDialog(true);
//               setNewCategoryName("");
//             }}
//           >
//             Додати категорію
//           </Button>
//         </Box>

//         {/* <AlertMessage
//           message={alertMessage}
//           onClose={() => setAlertMessage("")}
//         /> */}

//         <Paper className="category-tree">
//           {categories.map((category) => (
//             <CategoryItem
//               key={category.id}
//               category={category}
//               onEdit={() => startEdit(category)}
//               onAddSubcategory={() => {
//                 setIsSubcategory(true);
//                 setSelectedCategory(category);
//                 setOpenDialog(true);
//               }}
//               onDelete={() => handleDeleteCategory(category.id)}
//             />
//           ))}
//         </Paper>
//       </main>

//       <CategoryDialog
//         open={openDialog}
//         onClose={() => {
//           setOpenDialog(false);
//           setEditMode(false);
//           setNewCategoryName("");
//         }}
//         newCategoryName={newCategoryName}
//         setNewCategoryName={setNewCategoryName}
//         onSubmit={editMode ? handleEditCategory : handleAddCategory}
//         editMode={editMode}
//       />
//     </React.Fragment>
//   );
// };

// export default CategoryManager;
// import React from "react";
// import {
//   Form,
//   useLoaderData,
//   useNavigation,
//   useActionData,
//   useNavigate,
//   redirect,
// } from "react-router-dom";
// import {
//   Button,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Paper,
//   Box,
//   Alert,
// } from "@mui/material";
// import { Delete } from "@mui/icons-material";
// import customFetch from "../utils/customFetch";
// import { toast } from "react-toastify";

// // Loader function
// export const loader = async () => {
//   try {
//     const { data } = await customFetch.get(`/categories`);

//     // console.log("🚀 ~ loader ~  data:", data);
//     return data;
//   } catch (error) {
//     console.log("🚀 ~ loader ~ error:", error);
//     toast.error(error?.response.data?.msg);
//     return error;
//   }
// };

// // Action pour créer une catégorie (déjà existant)
// export const createCategoryAction = async ({ request }) => {
//   const formData = await request.formData();
//   const dataForm = Object.fromEntries(formData);

//   try {
//     const response = await customFetch.post("/categories", dataForm);
//     toast.success("Категорія успішно створена");
//     return redirect(`/dashboard/categories`);
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.msg || "Помилка при створенні категорії"
//     );
//     return error;
//   }
// };

// // Action pour modifier une catégorie
// export const updateCategoryAction = async ({ request, params }) => {
//   const formData = await request.formData();
//   const dataForm = Object.fromEntries(formData);
//   const categoryId = params.categoryId;

//   try {
//     const response = await customFetch.patch(
//       `/categories/${categoryId}`,
//       dataForm
//     );
//     toast.success("Категорію успішно оновлено");
//     return redirect(`/dashboard/categories`);
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.msg || "Помилка при оновленні категорії"
//     );
//     return error;
//   }
// };

// // Action pour supprimer une catégorie
// export const deleteCategoryAction = async ({ request, params }) => {
//   const categoryId = params.categoryId;

//   try {
//     const response = await customFetch.delete(`/categories/${categoryId}`);
//     toast.success("Категорію успішно видалено");
//     return redirect(`/dashboard/categories`);
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.msg || "Помилка при видаленні категорії"
//     );
//     return error;
//   }
// };

// // Action function for adding/editing categories
// export const categoryAction = async ({ request, params }) => {
//   const formData = await request.formData();
//   const intent = formData.get("intent");

//   switch (intent) {
//     case "create":
//       return createCategoryAction({ request, params });
//     case "update":
//       return updateCategoryAction({ request, params });
//     case "delete":
//       return deleteCategoryAction({ request, params });
//     default:
//       toast.error("Невідома дія");
//       return null;
//   }
// };
// function CategoryManager() {
//   const data = useLoaderData();
//   // console.log("🚀 ~ CategoryManager ~ data:", data);
//   const actionData = useActionData();
//   const navigation = useNavigation();
//   const navigate = useNavigate();

//   const [openDialog, setOpenDialog] = React.useState(false);
//   const [dialogMode, setDialogMode] = React.useState("add");
//   const [selectedCategory, setSelectedCategory] = React.useState(null);
//   const [selectedSubcategory, setSelectedSubcategory] = React.useState(null);

//   const handleOpenDialog = (mode, category = null, subcategory = null) => {
//     setDialogMode(mode);
//     setSelectedCategory(category);
//     setSelectedSubcategory(subcategory);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedCategory(null);
//     setSelectedSubcategory(null);
//   };

//   return (
//     <Form method="post">
//       <main className="main-content">
//         <Box
//           sx={{
//             mb: 4,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h4">Управління категоріями</Typography>
//           <Button
//             variant="contained"
//             startIcon={<span className="material-icons">add</span>}
//             onClick={() => handleOpenDialog("add")}
//           >
//             Додати категорію
//           </Button>
//         </Box>

//         {actionData?.error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {actionData.error}
//           </Alert>
//         )}

//         <Paper sx={{ p: "10px" }}>
//           {data.map((category) => {
//             return (
//               <Box key={category.id}>
//                 <Box
//                   component="div"
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     p: 1,
//                     borderRadius: "4px",
//                     m: "4px 0",
//                   }}
//                 >
//                   <input type="hidden" name="categoryId" value={category.id} />
//                   <span
//                     className="material-icons"
//                     style={{ marginRight: "8px" }}
//                   >
//                     folder
//                   </span>
//                   <Typography
//                     variant="subtitle1"
//                     className="category-name"
//                     sx={{
//                       flexGrow: 1,
//                       cursor: "pointer",
//                       borderRadius: "4px",
//                       p: "2px 4px",
//                     }}
//                     onClick={() => handleOpenDialog("edit-category", category)}
//                   >
//                     {category.name}
//                   </Typography>
//                   <Button
//                     size="small"
//                     startIcon={<span className="material-icons">add</span>}
//                     onClick={() =>
//                       handleOpenDialog("add-subcategory", category)
//                     }
//                   >
//                     Додати підкатегорію
//                   </Button>
//                   <Button
//                     type="submit"
//                     name="intent"
//                     value="delete-category"
//                     sx={{ background: "none", border: "none", color: "red" }}
//                     startIcon={<Delete />}
//                   ></Button>
//                 </Box>
//                 <Box component="div" sx={{ ml: 3 }}>
//                   {category.SubCategories.map((sub) => {
//                     return (
//                       <Box
//                         component="div"
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           p: 1,
//                           borderRadius: "4px",
//                           m: "4px 0",
//                         }}
//                         key={sub.id}
//                       >
//                         <input
//                           type="hidden"
//                           name="categoryId"
//                           value={category.id}
//                           // value={sub.categoryId}
//                         />
//                         <input
//                           type="hidden"
//                           name="subcategoryId"
//                           value={sub.id}
//                         />
//                         <span
//                           className="material-icons"
//                           style={{ marginRight: "8px" }}
//                         >
//                           subdirectory_arrow_right
//                         </span>
//                         <Typography
//                           variant="body1"
//                           className="category-name"
//                           onClick={() =>
//                             handleOpenDialog("edit-subcategory", category, sub)
//                           }
//                           sx={{
//                             flexGrow: 1,
//                             cursor: "pointer",
//                             p: "2px 4px",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           {sub.name}
//                         </Typography>
//                         <Button
//                           type="submit"
//                           size="large"
//                           name="intent"
//                           value="delete-subcategory"
//                           sx={{
//                             background: "none",
//                             border: "none",
//                             color: "red",
//                           }}
//                           startIcon={<Delete />}
//                         ></Button>
//                       </Box>
//                     );
//                   })}
//                 </Box>
//               </Box>
//             );
//           })}
//         </Paper>
//       </main>

//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         component="form"
//         method="post"
//       >
//         <DialogTitle>
//           {dialogMode === "add-category"
//             ? "Додати категорію"
//             : dialogMode === "add-subcategory"
//               ? "Додати підкатегорію"
//               : "Змінити назву"}
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             name="categoryName"
//             autoFocus
//             margin="dense"
//             label="Назва категорії"
//             fullWidth
//             variant="outlined"
//             defaultValue={
//               dialogMode === "edit-category"
//                 ? selectedCategory?.name
//                 : dialogMode === "edit-subcategory"
//                   ? selectedSubcategory?.name
//                   : ""
//             }
//           />
//           {selectedCategory && (
//             <input
//               type="hidden"
//               name="categoryId"
//               value={selectedCategory.id}
//             />
//           )}
//           {selectedSubcategory && (
//             <input
//               type="hidden"
//               name="subcategoryId"
//               value={selectedSubcategory.id}
//             />
//           )}
//           <input type="hidden" name="intent" value={dialogMode} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Скасувати</Button>
//           <Button type="submit" variant="contained">
//             {dialogMode.startsWith("add") ? "Додати" : "Зберегти"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Form>
//   );
// }

// export default CategoryManager;

import React from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
  useSubmit,
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

function CategoryManager() {
  const { data, error } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState(null);

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
