import { createTheme } from "@mui/material/styles";

// FIX P2-4: source unique de vérité pour les tokens visuels, auparavant
// dupliqués (F_BODY/F_DISPLAY/BLUE/GOLD/inputSx/selectSx) dans 15+ fichiers.
export const TOKENS = {
  fontBody: "'Plus Jakarta Sans', sans-serif",
  fontDisplay: "'Playfair Display', serif",
  blue: "#0057B8",
  blueDark: "#003d82",
  blueDarker: "#002255",
  gold: "#FFD700",
};

const theme = createTheme({
  palette: {
    primary: { main: TOKENS.blue, dark: TOKENS.blueDark },
    secondary: { main: TOKENS.gold },
  },
  typography: {
    fontFamily: TOKENS.fontBody,
    h1: { fontFamily: TOKENS.fontDisplay },
    h2: { fontFamily: TOKENS.fontDisplay },
    h3: { fontFamily: TOKENS.fontDisplay },
    h4: { fontFamily: TOKENS.fontDisplay },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#f8fafc",
          "& fieldset": { borderColor: "#e2e8f0" },
          "&:hover fieldset": { borderColor: TOKENS.blue },
          "&.Mui-focused fieldset": {
            borderColor: TOKENS.blue,
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontFamily: TOKENS.fontBody },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 700, borderRadius: 12 },
      },
    },
  },
});

export default theme;
