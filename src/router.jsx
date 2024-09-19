import { createBrowserRouter } from 'react-router-dom'; 
import AlumnoForm from './features/alumnos/components/alumnoForm';
import ListaAlumnos from './features/alumnos/components/listaAlumnos';  
import InscripcionForm from './features/inscripcion/components/inscripcionForm'; 
import PersonalForm from './features/personal/components/personalForm'; 
import ClaseForm from './features/clases/components/claseForm';
import AsistenciaForm from './features/asistencia/components/asistenciaForm';
import PagosForm from './features/pagos/components/pagosForm';  
import PaqueteForm from './features/paquetes/components/paqueteClasesForm'; 
import ListaIncripciones from './features/inscripcion/components/listaInscripcion'; 
import ListaPagos from  './features/pagos/components/listarPagos';  
import ListaPaquetes from  './features/paquetes/components/listarPaquetes'; 
import EditarPaquete from './features/paquetes/components/editarPaquete';
import QRCodeGenerator from './features/asistencia/components/credencial'
import QRCodeReader from './features/asistencia/components/tomarAsistencia';  
import Layout  from './global_components/Layout';  
 
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Ruta protegida si es necesario
    children: [
      { path: "registroAlumno", element: <AlumnoForm /> },
      { path: "listaAlumnos", element: <ListaAlumnos /> },
      { path: "inscripcion", element: <InscripcionForm /> },
      { path: "personal", element: <PersonalForm /> },
      { path: "clase", element: <ClaseForm /> },
      { path: "asistencia", element: <AsistenciaForm /> },
      { path: "pagos", element: <PagosForm /> },
      { path: "listaPagos", element: <ListaPagos /> },
      { path: "crearPaquete/:idClase/:horario/:curp", element: <PaqueteForm /> },
      { path: "listarInscripciones", element: <ListaIncripciones /> },
      { path: "listarPaquetes", element: <ListaPaquetes /> },
      
      { path: "editarPaquete/:curp", element: <EditarPaquete /> }, 
      { path: "leer", element: <QRCodeReader /> },
    ],
  },
  { path: "credencial", element: <QRCodeGenerator /> },
  // Puedes agregar más rutas aquí si es necesario
]);

export default router;