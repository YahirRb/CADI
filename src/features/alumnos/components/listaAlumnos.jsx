import { useEffect } from 'react';
import { useStudent } from '../hooks/useAlumno';
import { Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import "./listaAlumnos.css"
import { useNavigate } from 'react-router-dom';
const ListaAlumnos = () => {
  const { alumnos, loading, error, listaAlumnos } = useStudent();
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    listaAlumnos(); // Cargar alumnos al montar el componente
  }, []);

  if (loading) return <CircularProgress />; // Muestra un spinner mientras se cargan los datos
  if (error) return <Alert severity="error">{error}</Alert>; // Muestra el error si lo hay
  const handleAddStudent = () => {
    navigate('/registroAlumno'); // Ruta a la que redirige
  };

  const handleRowClick = (alumno) => {
    console.log(alumno); // Imprime el registro seleccionado en la consola
  };
  return (
    <div className="table-container-wrapper">
    <TableContainer component={Paper} className="table-container">
      <div className="table-header">
        <Table aria-label="lista de alumnos">
          <TableHead>
            <TableRow>
              <TableCell className="table-head-cell">ID</TableCell>
              <TableCell className="table-head-cell">Nombre</TableCell>
              <TableCell className="table-head-cell">Apellidos</TableCell>
              <TableCell className="table-head-cell">Tutor</TableCell>
              <TableCell className="table-head-cell">Correo</TableCell>
              <TableCell className="table-head-cell">Teléfono</TableCell>
              <TableCell className="table-head-cell">Fecha de Nacimiento</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </div>
      <div className="table-body-wrapper">
        <Table>
          <TableBody>
            {alumnos.map((alumno) => (
                <TableRow key={alumno.curp} className="table-row" onClick={() => handleRowClick(alumno)}>
                <TableCell className="table-cell">{alumno.curp}</TableCell>
                <TableCell className="table-cell">{alumno.nombre}</TableCell>
                <TableCell className="table-cell">{alumno.apellidos}</TableCell>
                <TableCell className="table-cell">{alumno.tutor}</TableCell>
                <TableCell className="table-cell">{alumno.correo}</TableCell>
                <TableCell className="table-cell">{alumno.telefono}</TableCell>
                <TableCell className="table-cell">{alumno.fechaNacimiento}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
    <Button
      variant="contained"
      className="registrar-alumno"
      startIcon={<Add />}
      onClick={handleAddStudent}
    >
      Nuevo Registro
    </Button>
  </div>
  );
};

export default ListaAlumnos;
