import { useEffect } from 'react';
import usePagos from '../hooks/usePagos'; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import './listaPagos.css'; 

const ListaPagos = () => {
  const { pagos, loading, error, listaPagos } = usePagos();

  useEffect(() => {
    listaPagos();
  }, []);

  if (loading) return <CircularProgress />; 
  if (error) return <Alert severity="error">{error}</Alert>; 

  return (
    <div className="table-container-wrapper">
      <TableContainer component={Paper} className="table-container">
        <Table aria-label="lista de pagos" className="table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-head-cell">ID</TableCell>
              <TableCell className="table-head-cell">CURP</TableCell>
              <TableCell className="table-head-cell">Monto</TableCell>
              <TableCell className="table-head-cell">Fecha de pago</TableCell>
              <TableCell className="table-head-cell">Proximo Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.length > 0 ? (
              pagos.map((pago) => (
                <TableRow key={pago.id} className="table-row">
                  <TableCell className="table-cell">{pago.idPago}</TableCell>
                  <TableCell className="table-cell">{pago.curp}</TableCell>
                  <TableCell className="table-cell">{pago.monto}</TableCell>
                  <TableCell className="table-cell">{pago.fecha_pago}</TableCell>
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

