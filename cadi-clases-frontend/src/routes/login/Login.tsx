import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import "./login.css";
import { useNavigate } from "react-router-dom";
import handleButtonSubmit from "./functions/handleButtonSubmit";
import handleEnterKeydown from "./functions/handleEnterKeydown";

export default function Login() {
  const nav = useNavigate();
  const minHeight380 = useMediaQuery("(max-height: 380px)");

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
    >
      <img
        src="https://picsum.photos/1280/720"
        alt="Imagen de fondo"
        style={{
          position: "absolute",
          top: "0px",
          width: "100%",
          height: "100%",
          objectFit: "fill",
          zIndex: -1,
        }}
      />
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "35px",
          padding: "25px",
          borderRadius: "25px",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(10px)",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          component={"h2"}
          fontSize={minHeight380 ? "1.5rem" : undefined}
        >
          Iniciar sesión
        </Typography>
        <Stack direction={minHeight380 ? "row" : "column"} gap={"25px"}>
          <TextField
            id="alumno-usuario"
            className="login-input"
            label="Usuario"
            variant="outlined"
            onKeyDown={handleEnterKeydown}
          />
          <TextField
            id="alumno-contrasena"
            className="login-input"
            label="Contraseña"
            variant="outlined"
            onKeyDown={handleEnterKeydown}
          />
        </Stack>
        <Button
          id="login-submit"
          variant="contained"
          onClick={handleButtonSubmit(nav)}
        >
          Iniciar sesión
        </Button>
      </Paper>
    </Box>
  );
}
