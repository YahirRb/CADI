import { useState } from 'react';
import { useClase } from '../hooks/useClases'; 
import { Grid, TextField, Button, Typography, CircularProgress, Alert, FormControlLabel, Checkbox, FormGroup, RadioGroup, Radio } from '@mui/material';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const ClaseForm = () => {
    const [nombreClase, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState(''); 
    const [costo, setCosto] = useState('');
    const [dias, setDias] = useState([]);
    const [horarios, setHorarios] = useState([{ inicio: '', fin: '' }]);
    const [turno, setTurno] = useState('');
    const { registroClase, loading, error } = useClase();
  
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const nombre = `${nombreClase}-${turno}`;
        
        // Crear el arreglo de horarios en el formato deseado
        const horariosFormateados = horarios.map(horario => `${horario.inicio}-${horario.fin}`).filter(horario => horario.includes('-'));
        
        // Enviar el arreglo de días y horarios
        registroClase({ nombre, descripcion, costo, dias, horario: horariosFormateados });
    };

    // Manejar cambios en los checkboxes de días
    const handleDiasChange = (e) => {
        const { value, checked } = e.target;
        setDias(prev =>
            checked ? [...prev, value] : prev.filter(dia => dia !== value)
        );
    };

    // Manejar cambios en los campos de horario
    const handleHorarioChange = (index, field, value) => {
        const newHorarios = [...horarios];
        newHorarios[index][field] = value;
        setHorarios(newHorarios);
    };

    // Añadir un nuevo bloque de horarios
    const handleAddHorario = () => {
        setHorarios([...horarios, { inicio: '', fin: '' }]);
    };

    // Eliminar un bloque de horarios
    const handleRemoveHorario = (index) => {
        const newHorarios = horarios.filter((_, i) => i !== index);
        setHorarios(newHorarios);
    };

    return (
        <div className="form-container">
            <Typography variant="h4" gutterBottom className="title">Registro de Clase</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Nombre de la clase */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre"
                            value={nombreClase}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            fullWidth
                            className="text-field"
                        />
                    </Grid>
                    {/* Descripción */}
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
                     
                    {/* Costo */}
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
                    {/* Turno */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>Turno</Typography>
                        <RadioGroup
                            row
                            value={turno}
                            onChange={(e) => setTurno(e.target.value)}
                        >
                            <FormControlLabel value="Matutino" control={<Radio />} label="Matutino" />
                            <FormControlLabel value="Vespertino" control={<Radio />} label="Vespertino" />
                        </RadioGroup>
                    </Grid>
                    {/* Días */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>Días de la clase</Typography>
                        <FormGroup row>
                            {diasSemana.map(dia => (
                                <FormControlLabel
                                    key={dia}
                                    control={
                                        <Checkbox
                                            checked={dias.includes(dia)}
                                            onChange={handleDiasChange}
                                            value={dia}
                                        />
                                    }
                                    label={dia}
                                />
                            ))}
                        </FormGroup>
                    </Grid>
                    {/* Horarios */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>Horarios</Typography>
                        {horarios.map((horario, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item xs={5}>
                                    <TextField
                                        label="Hora de Inicio"
                                        type="time"
                                        value={horario.inicio}
                                        onChange={(e) => handleHorarioChange(index, 'inicio', e.target.value)}
                                        required
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        className="text-field"
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        label="Hora de Fin"
                                        type="time"
                                        value={horario.fin}
                                        onChange={(e) => handleHorarioChange(index, 'fin', e.target.value)}
                                        required
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        className="text-field"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    {index > 0 && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleRemoveHorario(index)}
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                </Grid>
                                {/* Espacio entre horarios */}
                                <Grid item xs={12}>
                                    <div style={{ height: '20px' }}></div>
                                </Grid>
                            </Grid>
                        ))}
                        <Button variant="outlined" color="primary" onClick={handleAddHorario}>
                            Añadir Horario
                        </Button>
                    </Grid>
                    
                    {/* Botón de registro */}
                    <Grid item xs={12} className="buttonContainer">
                        <Button type="submit" variant="contained" color="primary" className="button" disabled={loading}>
                            {loading ? <CircularProgress size={24} className="spinner" /> : 'Registrar'}
                        </Button>
                    </Grid>
                    {/* Mostrar error en caso de fallo */}
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
