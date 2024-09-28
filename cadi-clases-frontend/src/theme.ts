import { createTheme } from "@mui/material";

const PRIMARY_COLOR = "#3C428E";
const SECONDARY_COLOR = "#E7333C";

const BG_COLOR_LIGHT = "#CCCCCC";
const BG_COLOR_CARDS_LIGHT = "#F5F5F5";
const BG_COLOR_DARK = "#333333";
const BG_COLOR_CARDS_DARK = "#0A0A0A";

const ERROR_COLOR_LIGHT = "#D67206";
const ERROR_COLOR_DARK = "#FF8F00";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: PRIMARY_COLOR },
    secondary: { main: SECONDARY_COLOR },
    background: { default: BG_COLOR_LIGHT, paper: BG_COLOR_CARDS_LIGHT },
  },
  typography: {
    fontFamily: "Fredoka",
    fontSize: 18,
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: PRIMARY_COLOR,
          },
          "&:hover .MuiInputLabel-root": {
            color: SECONDARY_COLOR,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          ".Mui-error": ERROR_COLOR_LIGHT,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          padding: "0 10px",
          "&::before": {
            borderBottom: `2px solid ${PRIMARY_COLOR}`,
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: `2px solid ${SECONDARY_COLOR}`,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: PRIMARY_COLOR,
            borderRadius: "15px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: SECONDARY_COLOR,
          },
          "& .MuiIconButton-root": {
            color: PRIMARY_COLOR,
            marginRight: 1,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          textTransform: "none",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: `3px solid ${PRIMARY_COLOR}`,
          boxShadow: "0px -5px 15px rgba(0, 0, 0, 0.25)",
          padding: "5px 0",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          "&.MuiLink-underlineAlways": {
            textDecorationColor: PRIMARY_COLOR,
            "&:hover": {
              textDecorationColor: SECONDARY_COLOR,
            },
          },
          "&.MuiLink-underlineHover": {
            textDecorationColor: "#FFFFFF00",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: "Fredoka";
          font-style: normal;
          font-weight: 300;
          font-size: 24px;
        }
      `,
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: SECONDARY_COLOR },
    secondary: { main: PRIMARY_COLOR },
    background: { default: BG_COLOR_DARK, paper: BG_COLOR_CARDS_DARK },
  },
  colorSchemes: {
    dark: true,
  },
  typography: {
    fontFamily: "Fredoka",
    fontSize: 18,
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: SECONDARY_COLOR,
          },
          "&:hover .MuiInputLabel-root": {
            color: PRIMARY_COLOR,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          padding: "0 10px",
          "&::before": {
            borderBottom: `2px solid ${SECONDARY_COLOR}`,
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: `2px solid ${PRIMARY_COLOR}`,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: SECONDARY_COLOR,
            borderRadius: "15px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: PRIMARY_COLOR,
          },
          "& .MuiIconButton-root": {
            color: SECONDARY_COLOR,
            marginRight: 1,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          textTransform: "none",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: `3px solid ${SECONDARY_COLOR}`,
          padding: "5px 0",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          "&.MuiLink-underlineAlways": {
            textDecorationColor: SECONDARY_COLOR,
            "&:hover": {
              textDecorationColor: PRIMARY_COLOR,
            },
          },
          "&.MuiLink-underlineHover": {
            textDecorationColor: "#FFFFFF00",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: "Fredoka";
          font-style: normal;
          font-weight: 300;
          font-size: 24px;
        }
      `,
    },
  },
});
