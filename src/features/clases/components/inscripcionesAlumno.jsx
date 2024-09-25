import { useEffect } from 'react';
import { useClase } from '../hooks/useClases'; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import useAuth from '../../../state/SesionState'; 
import './listaClases.css'; 

const InscripcionesAlumno = () => {
  const { username } = useAuth();
  const { clasesAlumno, loading, error, fetchClasesPorCURP } = useClase();

  useEffect(() => {
    if (username) {
      fetchClasesPorCURP(username);
      console.log('CURP:', username); // Verifica que CURP es correcto
    }
  }, [username]); // Añade username como dependencia

  useEffect(() => {
    console.log('Clases:', clasesAlumno); // Verifica los datos de clases
  }, [clasesAlumno]); // Log cuando clases cambian

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;



  return (
    <div className="table-container-wrapper">
      <TableContainer component={Paper} className="table-container">
        <Table aria-label="lista de clases" className="table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-head-cell">ID Clase</TableCell>
              <TableCell className="table-head-cell">Nombre</TableCell>
              <TableCell className="table-head-cell">Horario</TableCell>
              <TableCell className="table-head-cell">Fecha de Inscripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clasesAlumno.length > 0 ? (
              clasesAlumno.map((inscripcion) => (
                <TableRow 
                  key={inscripcion.idInscripcion} 
                  className="table-row"
                  onClick={() => handleRowClick(inscripcion)} 
                >
                  <TableCell className="table-cell">{inscripcion.clase ? inscripcion.clase.idClase : '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.clase ? inscripcion.clase.nombre : '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.horario || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.fechaInscripcion || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No se encontraron clases.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InscripcionesAlumno;
