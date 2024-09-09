import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; 
import AlumnoForm from './features/alumnos/components/alumnoForm';
import InscripcionForm from './features/inscripcion/components/inscripcionForm'; 
import PersonalForm from './features/personal/components/personalForm'; 
import ClaseForm from './features/clases/components/claseForm';
import AsistenciaForm from './features/asistencia/components/asistenciaForm';

const Layout = () => {
    return (
      <div>
        <header>
          <h2>Navigation</h2>
        </header>
        <main>
          <Outlet /> {/* Aquí se renderiza el componente correspondiente a la ruta actual */}
        </main>
      </div>
    );
  };
  
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Ruta protegida si es necesario
    children: [
      //{ path: "", element: <AlumnoForm /> },
      { path: "/inscripcion", element: <InscripcionForm /> },
      { path: "personal", element: <PersonalForm /> },
      { path: "clase", element: <ClaseForm /> },
      { path: "asistencia", element: <AsistenciaForm /> },
    ],
  },
  // Puedes agregar más rutas aquí si es necesario
]);

export default router;