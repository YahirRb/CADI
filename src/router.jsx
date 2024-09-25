import { createBrowserRouter } from 'react-router-dom'; 
import ProtectedRoute from './global_components/ProtectedRoute'
import AlumnoForm from './features/alumnos/components/alumnoForm';
import ListaAlumnos from './features/alumnos/components/listaAlumnos';  
import InscripcionForm from './features/inscripcion/components/inscripcionForm'; 
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
import InscripcionesAlumno from './features/clases/components/inscripcionesAlumno'
import Unauthorized from './global_components/Unauthorized';

import HomePage from './global_components/homePage';
import Login from "./global_components/login";
 
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Ruta protegida si es necesario
    children: [
      { path: "registroAlumno", element: <ProtectedRoute element={<AlumnoForm />} isAuthenticatedRequired={true}  isAdminRequired={true}/> },
      { path: "listaAlumnos", element: <ProtectedRoute element={<ListaAlumnos />} isAuthenticatedRequired={true} isAdminRequired={true}/> },
      { path: "inscripcion", element: <ProtectedRoute element={<InscripcionForm />} isAuthenticatedRequired={true} isAdminRequired={true}/> },
      { path: "clase", element: <ProtectedRoute element={<ClaseForm />} isAuthenticatedRequired={true}isAdminRequired={true}/> },
      { path: "asistencia", element: <ProtectedRoute element={<AsistenciaForm />} isAuthenticatedRequired={true}isAdminRequired={true}/> },
      { path: "pagos/:curp/:idPago/:monto", element: <ProtectedRoute element={<PagosForm />} isAuthenticatedRequired={true}isAdminRequired={true}/> },
      { path: "listaPagos", element: <ProtectedRoute element={<ListaPagos />} isAuthenticatedRequired={true}isAdminRequired={true}/> },
      { path: "crearPaquete/:idClase/:horario/:curp", element: <ProtectedRoute element={<PaqueteForm />} isAuthenticatedRequired={true} isAdminRequired={true}/> },
      { path: "listarInscripciones", element: <ProtectedRoute element={<ListaIncripciones />} isAuthenticatedRequired={true}isAdminRequired={true}/> },
      { path: "listarPaquetes", element: <ProtectedRoute element={<ListaPaquetes />} isAuthenticatedRequired={true}isAdminRequired={true}/> },
      { path: "editarPaquete/:curp", element: <ProtectedRoute element={<EditarPaquete />} isAuthenticatedRequired={true}/> }, 
      { path: "leer", element: <ProtectedRoute element={<QRCodeReader />} isAuthenticatedRequired={true}isAdminRequired={true}/> },
      { path: "credencial", element: <ProtectedRoute element={<QRCodeGenerator />} isAuthenticatedRequired={true}/> },
      
      { path: "clasesAlumno", element: <ProtectedRoute element={<InscripcionesAlumno />} isAuthenticatedRequired={true}/> },
      { path: "/", element: <ProtectedRoute element={<HomePage />} isAuthenticatedRequired={true}/> },
      { path: "/unauthorized", element: <ProtectedRoute element={<Unauthorized />} isAuthenticatedRequired={true}/> },
      
      
    ],
    
      
  },
  { path: "login/", element: <Login /> }
  // Puedes agregar más rutas aquí si es necesario
]);

export default router;