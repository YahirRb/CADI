// components/Layout.jsx
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./layout.css";
import MenuBanner from "../global_components/MenuBanner"; 
import { Assignment, School, HowToReg, Groups, NoteAdd, PersonAdd, AddBox,CardMembership,AssignmentInd } from "@mui/icons-material";
import CameraAltIcon  from "@mui/icons-material/CameraAlt";
import ListIcon from '@mui/icons-material/List';
import useAuth from '../state/SesionState';
import NotificationHandler from "./NotificationHandler";  // Importar el componente de notificaciones

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
  const { isAdmin, isAlumno } = useAuth(); // Obtener el estado de autenticación
  const menus = [
    //<OpcionMenu key={1} id="inscripcion" icon={<Assignment />} title="Inscripciones" route="/inscripcion" />,
    isAdmin && <OpcionMenu key={2} id="registro" icon={<PersonAdd />} title="Inscripciones" route="/registroAlumno" />,
    isAdmin && <OpcionMenu key={3} id="Clases" icon={<School />} title="Clases" route="/clase" />, 
    isAdmin && <OpcionMenu key={4} id="llenado_cedula" icon={<NoteAdd />} title="Pagos" route="/listaPagos" />,
    isAdmin && <OpcionMenu key={5} id="alumnos" icon={<HowToReg />} title="Alumno" route="/listaAlumnos" />, 
    isAlumno &&<OpcionMenu key={6} id="credencial" icon={<AssignmentInd />} title="Credencial" route="/credencial" />,
    isAdmin && <OpcionMenu key={7} id="Inscripciones" icon={<ListIcon />} title="Inscripciones" route="/listarInscripciones" />,
    isAdmin && <OpcionMenu key={8} id="Paquetes" icon={<AddBox />} title="Paquetes" route="/listarPaquetes" />,
    isAdmin && <OpcionMenu key={9} id="TomarAsistencia" icon={<CameraAltIcon />} title="Toma asistencia" route="/leer" />,


  ].filter(Boolean);

  useEffect(() => {
    ajustarContenido();
  }, []);

  return (
    <>
      <MenuBanner />
      <main className="menu_main">
        <NotificationHandler /> {/* Añadir el manejador de notificaciones aquí */}
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
