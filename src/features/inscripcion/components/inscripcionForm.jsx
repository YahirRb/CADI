import { useState } from 'react';
import { Grid, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';

import { useInscripcion } from '../hooks/useInscripcion'; // Asume que tendrás un hook similar
import './inscripcionForm.css'
const InscripcionForm = () => {
  const [curp, setCurp] = useState('');
  const [idClase, setIdClase] = useState('');
  const [fechaInscripcion, setFechaInscripcion] = useState('');
  const [acceso, setAcceso] = useState('');
  const { registroInscripcion, loading, error } = useInscripcion();

  const handleSubmit = (e) => {
    e.preventDefault();
    registroInscripcion({ curp, idClase, fechaInscripcion, acceso });
  };

  return (
    <div className="form-container">
      <Typography variant="h4" gutterBottom className="title">Registro de Inscripción</Typography>
      <form onSubmit={handleSubmit}>
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
              label="ID de Clase"
              value={idClase}
              onChange={(e) => setIdClase(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Inscripción"
              type="date"
              value={fechaInscripcion}
              onChange={(e) => setFechaInscripcion(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Acceso"
              value={acceso}
              onChange={(e) => setAcceso(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} className="buttonContainer">
            <Button type="submit" variant="contained" color="primary" className="button" disabled={loading}>
              {loading ? <CircularProgress size={24} className="spinner" /> : 'Registrar'}
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" className="alert">{error}</Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </div>
  );
};

export default InscripcionForm;