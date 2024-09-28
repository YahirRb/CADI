import "./App.css";
import { lightTheme, darkTheme } from "@/theme.ts";
import router from "@/router.tsx";
import { ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import useToggleTheme from "@/states/themeState";

function App() {
  const { isDarkMode } = useToggleTheme();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
