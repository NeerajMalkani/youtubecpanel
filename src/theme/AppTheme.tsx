import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#22a865",//"#28bc72", //"#45916B",//"#43926B",
    },
    secondary: {
      main: "#FFFF8F", //"#f1a7fe",
    },
    error: {
      main: "#ff5959",
    },
  },
});