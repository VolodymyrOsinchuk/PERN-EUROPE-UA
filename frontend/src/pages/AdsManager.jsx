import { useLoaderData, Form, redirect, Link } from "react-router-dom";
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
} from "@mui/material";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/adv");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const id = formData.get("id");

  try {
    await customFetch.delete(`/adv/${id}`);
    toast.success("Ad deleted successfully");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  return redirect("/dashboard/posts");
};

const AdsManager = () => {
  const ads = useLoaderData();

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
          Ads Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard/create-ad"
        >
          Create Ad
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>{ad.id}</TableCell>
                <TableCell>{ad.title}</TableCell>
                <TableCell>{ad.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    component={Link}
                    to={`/dashboard/edit-ad/${ad.id}`}
                  >
                    Edit
                  </Button>
                  <Form method="post" style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={ad.id} />
                    <Button variant="contained" color="secondary" type="submit">
                      Delete
                    </Button>
                  </Form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdsManager;
