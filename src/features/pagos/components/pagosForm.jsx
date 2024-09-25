import { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom'; // Importa useParams
import usePagos from '../hooks/usePagos'; 
import './pagosForm.css';

const PagosForm = () => {
  const { idPago, curp,monto } = useParams();  
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Establece la fecha actual

  const [pagosCurp, setPagosCurp] = useState([]);
  const { registroPago, listarPagosPorCurp, loading, error } = usePagos();

  // Muestra la CURP y el ID de clase en la consola
  useEffect(() => {
    console.log('CURP desde los parámetros:', curp);
    console.log('ID de Clase desde los parámetros:', idPago);
    
    console.log('ID de Clase desde los parámetros:', monto);
  }, [curp, idPago,monto]);

  const handleRegistroPago = async (e) => {
    e.preventDefault();
    try {
      await registroPago({idPago});
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
              value={curp} // Muestra la CURP desde los pa+
              required
              fullWidth
              className="text-field"
              disabled // Deshabilita el campo para evitar modificaciones
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Monto"
              type="number"
              value={monto} 
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

       
    </div>
  );
};

export default PagosForm;
