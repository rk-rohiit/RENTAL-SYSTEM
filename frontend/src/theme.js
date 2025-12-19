import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#cc0102" },
    secondary: { main: "#FF9800" },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#6B7280",
    },
  },

  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 18px",
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
