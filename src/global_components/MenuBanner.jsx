import { Button } from "@mui/material";
import "./menuBanner.css";
import { useNavigate } from "react-router-dom";
import { Close, DoorFrontOutlined, Menu } from "@mui/icons-material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Importa PropTypes

export default function MenuBanner() {
  const [menuClickeado, setMenuClickeado] = useState(false);
 
  const nav = useNavigate();



  // Efecto para expandir o contraer el menú cuando se clickea
  useEffect(() => {
    const menu_nav = document.getElementById("menu_nav");
    const opciones = Array.from(document.querySelectorAll(".opcion"));
    if (menu_nav) {
      if (menuClickeado) {
        menu_nav.style.width = "225px"; // Expande el menú
        menu_nav.style.paddingRight = "10px";
        opciones.forEach((opcion) => {
          opcion.style.width = "100%";
        });
      } else {
        menu_nav.style.width = "39px"; // Contrae el menú
        opciones.forEach((opcion) => {
          opcion.style.width = "36px";
        });
      }
    }
  }, [menuClickeado]);

  return (
    <header className="menu_banner">
      <div className="menu_logo">
        <span
          id="menu"
          className="menu"
          onClick={() => {
            setMenuClickeado(!menuClickeado);
          }}
        >
          {menuClickeado ? <Close /> : <Menu />}
        </span>
        <span
          className="identificador"
          onClick={() => {
            nav("/");
          }}
        >
          <img className="logo" src="../../public/foto.png" alt="Logo" />
          <h1 className="titulo_principal"></h1>
        </span>
      </div>
      
      <div className="cont_perfil">
        <Button
          variant="contained"
          startIcon={<DoorFrontOutlined />}
          onClick={async () => { 
            localStorage.clear();
            nav("/login");
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}

// Validación de las props
MenuBanner.propTypes = {
  mostrarBarraBusqueda: PropTypes.bool.isRequired, // Define el tipo y si es requerido
};
