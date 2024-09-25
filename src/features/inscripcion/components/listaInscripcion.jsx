import { useState, useEffect } from 'react';
import { useInscripcion } from '../hooks/useInscripcion'; // Ajusta la ruta según sea necesario
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Ajusta la ruta según sea necesario
import './listaInscripciones.css'; // Asegúrate de tener un archivo CSS similar para el estilo

const ListaInscripciones = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { inscripciones, loading, error, listaInscripciones } = useInscripcion();
  const navigate = useNavigate();

  useEffect(() => {
    listaInscripciones(); 
    console.log(filteredInscripciones.acceso)// Carga las inscripciones al montar el componente
  }, [ ]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Función para filtrar las inscripciones según el término de búsqueda
  const filteredInscripciones = searchTerm.trim() === ''
    ? inscripciones
    : inscripciones.filter(inscripcion => 
        inscripcion.curp?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Maneja el clic en una fila de la tabla
  const handleRowClick = (inscripcion) => {
    navigate(`/crearPaquete/${inscripcion.idInscripcion}/${inscripcion.horario}/${inscripcion.curp}`);
  };

  return (
    <div className="table-container-wrapper">
      <div className="search-container">
        <TextField
          label="Buscar por CURP"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
      </div>
      
      <TableContainer component={Paper} className="table-container">
        <Table aria-label="lista de inscripciones" className="table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-head-cell">ID</TableCell>
              <TableCell className="table-head-cell">CURP</TableCell>
              <TableCell className="table-head-cell">ID Clase</TableCell>
              <TableCell className="table-head-cell">Fecha de Inscripción</TableCell>
              <TableCell className="table-head-cell">Acceso</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInscripciones.length > 0 ? (
              filteredInscripciones.map((inscripcion) => (
                <TableRow 
                  key={inscripcion.idInscripcion} 
                  className="table-row"
                  onClick={() => handleRowClick(inscripcion)} // Añadido el manejador de clic
                >
                  <TableCell className="table-cell">{inscripcion.idInscripcion || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.curp || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.idClase || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.fechaInscripcion || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.acceso || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron inscripciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListaInscripciones;
