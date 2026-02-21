import { useLoaderData, Form, redirect } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    try {
      await customFetch.delete(`/users/${formData.get("id")}`);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
    return redirect("/dashboard/users");
  }

  if (intent === "create") {
    try {
      await customFetch.post("/users", Object.fromEntries(formData));
      toast.success("User created successfully");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
    return redirect("/dashboard/users");
  }

  if (intent === "update") {
    try {
      await customFetch.put(
        `/users/${formData.get("id")}`,
        Object.fromEntries(formData)
      );
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
    return redirect("/dashboard/users");
  }
};

import { useState } from "react";

const Users = () => {
  const users = useLoaderData();
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    intent: "",
    user: null,
  });

  const handleClickOpen = (intent, user = null) => {
    setDialogData({ intent, user });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClickOpen("create")}
        >
          Create User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleClickOpen("update", user)}
                  >
                    Edit
                  </Button>
                  <Form method="post" style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={user.id} />
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      name="intent"
                      value="delete"
                    >
                      Delete
                    </Button>
                  </Form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {dialogData.intent === "create" ? "Create User" : "Edit User"}
        </DialogTitle>
        <Form method="post">
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              defaultValue={dialogData.user?.email}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              disabled={dialogData.intent === "update"}
            />
            <TextField
              margin="dense"
              name="role"
              label="Role"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={dialogData.user?.role}
            />
            <input type="hidden" name="id" value={dialogData.user?.id} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" name="intent" value={dialogData.intent}>
              {dialogData.intent === "create" ? "Create" : "Update"}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </Box>
  );
};

export default Users;
