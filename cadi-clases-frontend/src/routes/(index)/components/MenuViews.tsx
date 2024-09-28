import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Icon as YesIcon } from "@iconify/react";
import NavItem from "./NavItems";
import Divider from "@/components/Divider";
import useNavigationState from "@/states/navigationState";

import "./menuviews.css";

export const StudentDesktopOptions = () => (
  <>
    <NavItem icon="ri:calendar-schedule-fill" text="Horario" />
    <Divider />
    <NavItem icon="ri:id-card-fill" text="Credencial" />
    <Divider />
    <NavItem icon="streamline:bill-4-solid" text="Pagos" />
  </>
);

export const StudentMobileOptions = () => {
  const { indexNav, setIndexNav } = useNavigationState();

  return (
    <>
      <BottomNavigation
        className="bottom-navbar-student"
        showLabels={false}
        sx={{
          position: "absolute",
          left: "0",
          bottom: "0",
          width: "100%",
        }}
        value={indexNav}
        onChange={(_, value) => setIndexNav(value)}
      >
        <BottomNavigationAction
          label="Horario"
          icon={<YesIcon icon="ri:calendar-schedule-fill" fontSize={"24px"} />}
        />
        <BottomNavigationAction
          label="Credencial"
          icon={<YesIcon icon="ri:id-card-fill" fontSize={"24px"} />}
        />
        <BottomNavigationAction
          label="Pagos"
          icon={<YesIcon icon="streamline:bill-4-solid" fontSize={"24px"} />}
        />
      </BottomNavigation>
    </>
  );
};

export const AdminDesktopOptions = () => (
  <>
    <NavItem icon="ri:user-add-fill" text="Añadir alumno" />
    <NavItem icon="mdi:notebook-plus" text="Añadir clase" />
  </>
);

export const AdminMobileOptions = () => {
  const { indexNav, setIndexNav } = useNavigationState();

  return (
    <>
      <BottomNavigation
        className="bottom-navbar-admin"
        showLabels={false}
        sx={{
          position: "absolute",
          left: "0",
          bottom: "0",
          width: "100%",
        }}
        value={indexNav}
        onChange={(_, value) => setIndexNav(value)}
      >
        <BottomNavigationAction
          label="Inscribir alumno"
          icon={<YesIcon icon="ri:user-add-fill" fontSize={"24px"} />}
        />
        <BottomNavigationAction
          label="Agregar clase"
          icon={<YesIcon icon="mdi:notebook-plus" fontSize={"24px"} />}
        />
      </BottomNavigation>
    </>
  );
};
