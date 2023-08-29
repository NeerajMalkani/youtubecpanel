import { Alert, Box, Paper, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import configData from "../../config.json";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const LoginPage = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["ycp"]);

  const [loading, setIsLoading] = useState(false);
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [username, setUsername] = useState("");

  const [isPasswordError, setIsPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (cookies && cookies.ycp && cookies.ycp.username) navigate(`/dashboard`);
  }, []);

  const LoginClick = () => {
    setIsLoading(true);
    let isValid = true;
    if (username == "") {
      setIsUsernameError(true);
      setUsername("Please enter Username");
      isValid = false;
    }

    if (password == "") {
      setIsPasswordError(true);
      setPasswordError("Please enter Password");
      isValid = false;
    }

    if (isValid) {
      if (configData.Creds.username === username && configData.Creds.password === password) {
        const user = { username: username };
        setCookie("ycp", JSON.stringify(user), { path: "/" });
        navigate(`/dashboard`);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarMessage("Incorrect Username or Password");
        setIsLoading(false);
      }
    }
  };
  const OnPasswordeChange = (text: string) => {
    if (text != "") {
      setPassword(text);
      setIsPasswordError(false);
      setPasswordError("");
    }
  };

  const OnUsernameChange = (text: string) => {
    if (text != "") {
      setUsername(text);
      setIsUsernameError(false);
      setUsernameError("");
    }
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  return (
    <Box height="100vh" className="flex-center">
      <Paper
        className="padding-32 flex-center flex-column"
        sx={{
          minWidth: { sm: 480 },
          width: { xs: "100%", sm: "unset" },
          boxShadow: {
            xs: "unset",
            sm: "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
          },
        }}
      >
        <img className="margin-bottom-24" src={""} alt="Samadhan-Diamond Frames" width={104} height={104} />

        <TextField
          fullWidth
          label="Username"
          variant="filled"
          size="small"
          inputProps={{
            maxLength: 50,
          }}
          onChange={(e) => {
            OnUsernameChange(e.target.value);
          }}
          error={isUsernameError}
          helperText={usernameError}
          value={username}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="filled"
          size="small"
          onChange={(e) => {
            OnPasswordeChange(e.target.value);
          }}
          error={isPasswordError}
          helperText={passwordError}
          value={password}
          sx={{ mb: 1 }}
        />

        <LoadingButton loading={loading} type="submit" variant="contained" fullWidth={true} onClick={LoginClick}>
          Login
        </LoadingButton>
      </Paper>
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
