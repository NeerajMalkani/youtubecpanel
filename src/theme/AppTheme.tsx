import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#c00001",//"#28bc72", //"#45916B",//"#43926B",
    },
    secondary: {
      main: "#006874", //"#f1a7fe",
    },
    error: {
      main: "#ba1a1a",
    },
  },
});