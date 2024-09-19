import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./layout.css";
import MenuBanner from "../global_components/MenuBanner"; 
import { Assignment,School,HowToReg, Groups, NoteAdd,PersonAdd,AddBox} from "@mui/icons-material";


function seleccionarOpcion(id) {
  const antiguaOpcion = document.querySelector(".opcion_seleccionada");
  const nuevaOpcion = document.getElementById(id);
  if (antiguaOpcion != null) {
    antiguaOpcion.classList.remove("opcion_seleccionada");
  }
  if (nuevaOpcion != null) {
    nuevaOpcion.classList.add("opcion_seleccionada");
  }
}



function ajustarContenido() {
  const contenidoMenu = document.querySelector(".cuerpo_menu");
  const header = document.querySelector(".menu_banner");
  if (contenidoMenu) {
    const headerHeight = header.offsetHeight;
    const windowHeight = window.innerHeight;
    const nuevaAltura = windowHeight - headerHeight - 55;
    contenidoMenu.style.height = nuevaAltura + "px";
  }
}

export default function Layout() {  

  const menus = [
    <OpcionMenu key={1} id="hoy_imm" icon={<Assignment />} title="Inscripciones" route="/inscripcion" />,
    <OpcionMenu key={2} id="regustro" icon={<PersonAdd />} title="Inscripciones" route="/registroAlumno" />,
    <OpcionMenu key={3} id="Clases" icon={<School />} title="Clases" route="/clase" />, 
    <OpcionMenu key={4} id="llenado_cedula" icon={<NoteAdd />} title="Pagos" route="/listaPagos" />,
    <OpcionMenu key={5} id="alumnos" icon={<HowToReg />} title="Alumno" route="/listaAlumnos" />, 
    <OpcionMenu key={6} id="empleados" icon={<Groups />} title="Personal" route="/personal" />,
    
    <OpcionMenu key={7} id="paquete" icon={<AddBox />} title="Paquetes" route="/crearPaquete" />,
  ];

  useEffect(() => {
    ajustarContenido();
  }, []);

  return (
    <>
      <MenuBanner />
      <main className="menu_main">
        <nav className="navbar" id="menu_nav">
          {menus}
        </nav>
        <section className="contenido_menu">
          <div className="cuerpo_menu">
            <Outlet />
          </div>
        </section>
      </main>
    </>
  );
}

function OpcionMenu({ id, icon, title, route }) {
  
  const nav = useNavigate();

  return (
    <span
      className="navbar_item"
      id={id}
      onClick={() => {
        seleccionarOpcion(id);
        nav(route);
      }}
    >
      {icon}
      <p>{title}</p>
    </span>
  );
}
