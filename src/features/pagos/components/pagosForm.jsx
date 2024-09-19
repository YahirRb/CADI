import { useState } from 'react';
import { Grid, TextField, Button, Typography, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import usePagos from '../hooks/usePagos'; // Importa el hook personalizado para pagos
import './pagosForm.css';

const PagosForm = () => {
  const [curp, setCurp] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [pagosCurp, setPagosCurp] = useState([]);
  const { registrarPago, listarPagosPorCurp, loading, error } = usePagos();

  const handleRegistroPago = async (e) => {
    e.preventDefault();
    try {
      await registrarPago({ curp, monto, fecha });
      alert('Pago registrado exitosamente');
    } catch (err) {
      alert(`Error al registrar el pago: ${err.message}`);
    }
  };

  const handleListarPagosPorCurp = async () => {
    try {
      const pagos = await listarPagosPorCurp(curp);
      setPagosCurp(pagos);
    } catch (err) {
      alert(`Error al listar pagos por CURP: ${err.message}`);
    }
  };

  return (
    <div className="form-container">
      <Typography variant="h4" gutterBottom className="title">Registro de Pago</Typography>
      <form onSubmit={handleRegistroPago}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="CURP"
              value={curp}
              onChange={(e) => setCurp(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Monto"
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} className="buttonContainer">
            <Button type="submit" variant="contained" color="primary" className="button" disabled={loading}>
              {loading ? <CircularProgress size={24} className="spinner" /> : 'Registrar Pago'}
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" className="alert">{error.message}</Alert>
            </Grid>
          )}
        </Grid>
      </form>

      <Typography variant="h4" gutterBottom className="title">Listado de Pagos por CURP</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleListarPagosPorCurp} 
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} className="spinner" /> : 'Listar Pagos'}
      </Button>
      <List>
        {pagosCurp.length > 0 ? (
          pagosCurp.map(pago => (
            <ListItem key={pago.id}>
              <ListItemText
                primary={`Monto: ${pago.monto}, Fecha: ${pago.fecha}`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No se han encontrado pagos." />
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default PagosForm;
