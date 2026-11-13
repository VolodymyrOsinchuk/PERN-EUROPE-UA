import { Box, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

const PlaceholderImage = ({ width = 200, height = 200, sx }) => (
  <Box
    sx={{
      width,
      height,
      borderRadius: "16px",
      bgcolor: "#f1f5f9",
      border: "1.5px dashed #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#94a3b8",
      ...sx,
    }}
  >
    <ImageIcon sx={{ fontSize: 40, mb: 1 }} />
    <Typography variant="caption" fontSize="0.75rem" fontWeight={600}>
      Немає фото
    </Typography>
  </Box>
);

export default PlaceholderImage;
