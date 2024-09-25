import { useState, useEffect } from 'react';
import usePagos from '../hooks/usePagos'; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './listaPagos.css'; 

const ListaPagos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { pagos, loading, error, listaPagos } = usePagos();
  const navigate = useNavigate();

  useEffect(() => {
    listaPagos(); // Llama a la función para cargar los datos
  }, [listaPagos]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Filtra los pagos según el término de búsqueda
  const filteredPagos = searchTerm.trim() === ''
    ? pagos
    : pagos.filter(pago => 
        pago.alumno['curp']?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Maneja el clic en una fila de la tabla
  const handleRowClick = (curp, idPago, monto) => {
    // Guarda la CURP y el ID de pago en el localStorage o en el estado de la aplicación
    localStorage.setItem('curp', curp);
    localStorage.setItem('idPago', idPago);

    // Redirige a la página de pagos con la CURP como parámetro
    navigate(`/pagos/${curp}/${idPago}/${monto}`); 
  };

  return (
    <div className="table-container-wrapper">
      <h2>Lista de Pagos</h2>
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
        <Table aria-label="lista de pagos" className="table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-head-cell">CURP</TableCell>
              <TableCell className="table-head-cell">Nombre</TableCell>
              <TableCell className="table-head-cell">Clase</TableCell>
              <TableCell className="table-head-cell">Monto</TableCell>
              <TableCell className="table-head-cell">Próximo Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPagos.length > 0 ? (
              filteredPagos.map((pago) => (
                <TableRow 
                  key={pago.idPago} 
                  className="table-row"
                  onClick={() => handleRowClick(pago.alumno['curp'], pago.idPago, pago.monto)} // Manejador de clic
                  hover // Añade efecto hover
                >
                  <TableCell className="table-cell">{pago.alumno['curp']}</TableCell>
                  <TableCell className="table-cell">{pago.alumno['nombre']}</TableCell>
                  <TableCell className="table-cell">{pago.clase['nombre']}</TableCell>
                  <TableCell className="table-cell">{pago.monto}</TableCell>
                  <TableCell className="table-cell">{pago.proximo_pago}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron pagos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListaPagos;
