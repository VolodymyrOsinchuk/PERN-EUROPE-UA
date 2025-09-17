import { useLoaderData, Form, redirect } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/adv/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const updatedAd = Object.fromEntries(formData);

  try {
    await customFetch.put(`/adv/${params.id}`, updatedAd);
    toast.success("Ad updated successfully");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  return redirect("/dashboard/posts");
};

const EditAdPage = () => {
  const ad = useLoaderData();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Ad
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Form method="post">
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ad.title}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            defaultValue={ad.description}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={ad.price}
          />
          <TextField
            margin="dense"
            name="country"
            label="Country"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ad.country}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ad.state}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ad.city}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ad.location}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={ad.email}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={ad.phone}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Update Ad
          </Button>
        </Form>
      </Paper>
    </Box>
  );
};

export default EditAdPage;
