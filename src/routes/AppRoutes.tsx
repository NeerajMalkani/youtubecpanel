import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { theme } from "../theme/AppTheme";
import LoginPage from "../ui/LoginPage";

const AppRoutes = () => {
  return (
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ backgroundColor: "background.default" }}>
          <BrowserRouter>
            <Route path="/" element={<LoginPage />} />
            <Route path="login" element={<LoginPage />} />
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </CookiesProvider>
  );
};