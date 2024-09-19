import { useState } from 'react';
import { useClase } from '../hooks/useClases'; 
import { Grid, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';


const ClaseForm = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cupo, setCupo] = useState('');
    const [costo, setCosto] = useState('');
    const [dias, setDias] = useState('');
    const [horario, setHorario] = useState('');
    const { registroClase, loading, error } = useClase();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Convierte la cadena de días en un array
      const diasArray = dias.split(',').map(dia => dia.trim());
      registroClase({ nombre, descripcion, cupo, costo, dias: diasArray, horario });
    };
  
    return (
      <div className="form-container">
      <Typography variant="h4" gutterBottom className="title">Registro de Clase</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cupo"
              type="number"
              value={cupo}
              onChange={(e) => setCupo(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Costo"
              type="number"
              step="0.01"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Días"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              required
              fullWidth
              className="text-field"
              placeholder="Ingresa días separados por comas"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Horario"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
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
  
  export default ClaseForm;
  