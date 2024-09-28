import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Icon from "@/components/Icon";
import Logo from "@images/logo.png";
import useToggleTheme from "@/states/themeState";
import { Outlet, useNavigate } from "react-router-dom";
import useNavigationState from "@/states/navigationState";
import { UserRole } from "@/types/user";
import {
  AdminDesktopOptions,
  AdminMobileOptions,
  StudentDesktopOptions,
  StudentMobileOptions,
} from "./components/MenuViews";
import { View } from "@/types/views";

import "./layout.css";

const view: UserRole = "student";

const views: { [key: string]: View } = {
  student: {
    desktop: <StudentDesktopOptions />,
    mobile: <StudentMobileOptions />,
  },
  admin: {
    desktop: <AdminDesktopOptions />,
    mobile: <AdminMobileOptions />,
  },
};

export default function Layout() {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useToggleTheme();
  const nav = useNavigate();
  const [openNavDrawer, setOpenNavDrawer] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const openMenu = Boolean(menuAnchorEl);

  const showBottomNavbar = useMediaQuery("(max-width: 576px)");

  return (
    <>
      <AppBar
        elevation={10}
        enableColorOnDark={true}
        sx={{
          width: "100vw",
          height: "75px",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: "100%", gap: "25px" }}>
          {showBottomNavbar ? (
            <></>
          ) : (
            <Button onClick={() => setOpenNavDrawer((prevState) => !prevState)}>
              {openNavDrawer ? (
                <Icon
                  icon="ri:close-large-fill"
                  color={theme.palette.background.default}
                />
              ) : (
                <Icon
                  icon="rivet-icons:menu"
                  color={theme.palette.background.default}
                />
              )}
            </Button>
          )}
          <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
            <Box width={"50px"} height={"50px"}>
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Typography variant="h6" component={"h1"}>
              Alumnos
            </Typography>
          </Stack>
          <Box flex={1}></Box>
          <Tooltip title="Opciones">
            <Button
              sx={{ position: "relative" }}
              onClick={(event: React.MouseEvent<HTMLElement>) =>
                setMenuAnchorEl(event.currentTarget)
              }
            >
              <Icon
                icon="ri:more-2-fill"
                color={theme.palette.background.default}
              />
            </Button>
          </Tooltip>
          <Menu
            open={openMenu}
            onClose={() => setMenuAnchorEl(null)}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
          >
            <MenuItem>
              <ListItemButton
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation;
                  toggleTheme();
                }}
              >
                <ListItemIcon>
                  <Icon icon="ri:sun-fill" />
                </ListItemIcon>
                Modo oscuro
                <Switch checked={isDarkMode} />
              </ListItemButton>
            </MenuItem>
            <MenuItem>
              <ListItemButton onClick={() => nav("/login")}>
                <ListItemIcon>
                  <Icon icon="ri:door-closed-fill" />
                </ListItemIcon>
                Cerrar sesión
              </ListItemButton>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {!showBottomNavbar && (
        <Drawer
          className="drawer-nav"
          variant="permanent"
          component={"nav"}
          PaperProps={{
            sx: {
              width: openNavDrawer ? "250px" : "57px",
              height: "calc(100vw - 75px)",
              borderRight: `3px solid ${theme.palette.primary.main}`,
              boxSizing: "border-box",
              overflowX: "hidden",
            },
          }}
        >
          <List
            className="navbar-list"
            disablePadding
            sx={{
              marginTop: "75px",
            }}
          >
            {views[view].desktop}
          </List>
        </Drawer>
      )}
      <Box
        position={"absolute"}
        top={"75px"}
        left={showBottomNavbar ? "0" : openNavDrawer ? "250px" : "57px"}
        width={
          showBottomNavbar
            ? "100vw"
            : `calc(100vw - ${openNavDrawer ? "250px" : "57px"})`
        }
        height={
          showBottomNavbar ? "calc(100vh - 75px - 66px)" : "calc(100vh - 75px)"
        }
      >
        <Outlet />
      </Box>
      {showBottomNavbar && views[view].mobile}
    </>
  );
}
