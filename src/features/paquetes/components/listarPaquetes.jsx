import { useState, useEffect } from 'react';
import { usePaquete } from '../hooks/usePaqueteClase'; // Ajusta la ruta según sea necesario
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './listaPaquetes.css'; // Asegúrate de tener un archivo CSS similar para el estilo

const ListaPaquetes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { paquetes, loading, error, cargarPaquetes } = usePaquete();
  const navigate = useNavigate();

  useEffect(() => {
    cargarPaquetes(); // Carga los paquetes al montar el componente
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Función para filtrar los paquetes según el término de búsqueda
  const filteredPaquetes = searchTerm.trim() === ''
    ? paquetes
    : paquetes.filter(paquete => 
        paquete.curp?.toLowerCase() === searchTerm.toLowerCase()
      );

  // Maneja el clic en una fila de la tabla
  const handleRowClick = (paquete) => {
    console.log('Datos del paquete seleccionado:', paquete);
    navigate(`/editarPaquete/${paquete.curp}`); // Redirige a una página de detalles del paquete
  };

  return (
    <div className="table-container-wrapper">
      <h2>Paquetes Registrados</h2>
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
        <Table aria-label="lista de paquetes" className="table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-head-cell table-head-cell-id">ID</TableCell>
              <TableCell className="table-head-cell table-head-cell-nombre">Nombre</TableCell>
              <TableCell className="table-head-cell table-head-cell-precio">Precio Total</TableCell>
              <TableCell className="table-head-cell table-head-cell-curp">CURP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPaquetes.length > 0 ? (
              filteredPaquetes.map((paquete) => (
                <TableRow 
                  key={paquete.idPaquete} 
                  className="table-row"
                  onClick={() => handleRowClick(paquete)} // Añadido el manejador de clic
                >
                  <TableCell className="table-cell table-cell-id">{paquete.idPaquete}</TableCell>
                  <TableCell className="table-cell table-cell-nombre">{paquete.nombre}</TableCell>
                  <TableCell className="table-cell table-cell-precio">{paquete.precio_total}</TableCell>
                  <TableCell className="table-cell table-cell-curp">{paquete.curp}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No se encontraron paquetes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListaPaquetes;
