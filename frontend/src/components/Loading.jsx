import React from "react";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";

/**
 * Loading component with multiple display modes
 * @param {Object} props - Component properties
 * @param {string} [props.type='circular'] - Type of loading indicator ('circular' or 'linear')
 * @param {string} [props.message] - Optional message to display
 * @param {number} [props.size] - Size of circular progress (default 40)
 * @param {number} [props.thickness] - Thickness of circular progress (default 4)
 * @param {string} [props.color] - Color of the progress indicator
 * @param {boolean} [props.fullHeight] - Whether to make loading full height of container
 */
const Loading = ({
  type = "circular",
  message,
  size = 40,
  thickness = 4,
  color = "primary",
  fullHeight = false,
}) => {
  const theme = useTheme();

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    ...(fullHeight
      ? {
          height: "100%",
          minHeight: "100vh",
        }
      : {}),
    padding: theme.spacing(2),
  };

  return (
    <Box sx={containerStyle}>
      <Stack spacing={2} alignItems="center" justifyContent="center">
        {type === "circular" ? (
          <CircularProgress color={color} size={size} thickness={thickness} />
        ) : (
          <LinearProgress color={color} sx={{ width: "100%" }} />
        )}

        {message && (
          <Typography variant="body2" color="textSecondary" align="center">
            {message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Loading;
