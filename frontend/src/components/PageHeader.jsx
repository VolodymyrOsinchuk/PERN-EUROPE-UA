import { Box, Typography, Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

/**
 * PageHeader — consistent header for all admin pages
 * Props:
 *  - title: string
 *  - subtitle?: string
 *  - breadcrumbs?: [{ label, to? }]
 *  - action?: ReactNode (a button, etc.)
 */
const PageHeader = ({ title, subtitle, breadcrumbs, action }) => (
  <Box sx={{ mb: 4 }}>
    {breadcrumbs && (
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 14 }} />}
        sx={{ mb: 1.5 }}
      >
        {breadcrumbs.map((crumb, i) =>
          crumb.to ? (
            <MuiLink
              key={i}
              component={Link}
              to={crumb.to}
              underline="hover"
              sx={{ fontSize: "0.8rem", color: "text.secondary" }}
            >
              {crumb.label}
            </MuiLink>
          ) : (
            <Typography
              key={i}
              sx={{
                fontSize: "0.8rem",
                color: "text.primary",
                fontWeight: 500,
              }}
            >
              {crumb.label}
            </Typography>
          ),
        )}
      </Breadcrumbs>
    )}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  </Box>
);

export default PageHeader;
