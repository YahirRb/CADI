import { useState, useEffect } from 'react';
import usePagos from '../../pagos/hooks/usePagos'; // Asegúrate de que la ruta sea correcta
import { useStudent } from '../hooks/useAlumno';
import { useInscripcion } from '../../inscripcion/hooks/useInscripcion';
import { useClase } from '../../clases/hooks/useClases';
import './alumnoForm.css';
import { Grid, TextField, Button, Typography, CircularProgress, Alert, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AlumnoForm = () => {
  const [curp, setCurp] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tutor, setTutor] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [foto, setFoto] = useState(null); // Estado para la foto
  const [successMessage, setSuccessMessage] = useState('');
  const [idClase, setIdClase] = useState('');
  const [fechaInscripcion, setFechaInscripcion] = useState('');
  const [costoInscripcion, setCostoInscripcion] = useState(500); // Valor predeterminado
  const [proximaFechaPago, setProximaFechaPago] = useState('');
  const [costoClase, setCostoClase] = useState(0); 
  const [crearPaquete, setCrearPaquete] = useState(false); // Estado para definir si se crea un paquete
  const [clasesSeleccionadas, setClasesSeleccionadas] = useState([]);
  const [dias, setDias] = useState([]);
  const [horario, setHorario] = useState([]); // Inicializado como array vacío
  const [turno, setTurno] = useState(''); // Estado para almacenar la información de la clase seleccionada
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(''); // Estado para almacenar el horario seleccionado

  const { pagos, registroPago, loadingPago, errorPago } = usePagos();
  const { clases, registroClase, loadingClase, errorClase } = useClase();
  const { registroInscripcion, loadingInscripcion, errorInscripcion } = useInscripcion();
  const { registro,buscarAlumno, loading, error } = useStudent();
  const navigate = useNavigate();

  const obtenerFechaActual = () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  const calcularProximaFechaPago = (fechaInscripcion) => {
    const fecha = new Date(fechaInscripcion);
    fecha.setMonth(fecha.getMonth() + 1); 
    return fecha.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fechaActual = obtenerFechaActual();
    setFechaInscripcion(fechaActual);
    setProximaFechaPago(calcularProximaFechaPago(fechaActual));

    if (!crearPaquete && idClase) {
      const claseSeleccionada = clases.find(clase => clase.idClase === idClase);
      if (claseSeleccionada) {
        setCostoClase(claseSeleccionada.costo);
        setDias(claseSeleccionada.dias);
        setHorario(claseSeleccionada.horario || []); // Asegúrate de que sea un array
        setTurno(claseSeleccionada.turno);
      }
    } else if (crearPaquete && clasesSeleccionadas.length > 0) {
      const costoTotalPaquete = clasesSeleccionadas.reduce((acc, idClase) => {
        const clase = clases.find(clase => clase.idClase === idClase);
        return acc + (clase ? clase.costo : 0);
      }, costoInscripcion);
      console.log(`Costo Total del Paquete: ${costoTotalPaquete}`);
    }
  }, [idClase, crearPaquete, clases, costoInscripcion, clasesSeleccionadas]);

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handlePaqueteChange = (e) => {
    setCrearPaquete(e.target.checked);
    setClasesSeleccionadas([]);
    if (!e.target.checked) {
      setIdClase('');
      setDias([]);
      setHorario([]);
      setTurno('');
    }
  };

  const handleClaseSelection = (e) => {
    if (crearPaquete) {
      const { value } = e.target;
      setClasesSeleccionadas(prev =>
        prev.includes(value) ? prev.filter(id => id !== value) : [...prev, value]
      );
    } else {
      const selectedClass = clases.find(clase => clase.idClase === e.target.value);
      setIdClase(e.target.value);
      setDias(selectedClass?.dias || []);
      setHorario(selectedClass?.horario || []); // Asegúrate de que sea un array
      setTurno(selectedClass?.turno || '');
    }
  };

  const handleHorarioSelection = (e) => {
    const selectedHorario = e.target.value;
    if (horario.includes(selectedHorario)) {
      setHorarioSeleccionado(selectedHorario);
    } else {
      console.error('Horario seleccionado no válido:', selectedHorario);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Paso 1: Verificar si el alumno ya está registrado
      await registro({ curp, nombre, apellidos, tutor, correo, telefono, fechaNacimiento });
      const alumnoExistente = await buscarAlumno(curp); 
      if (alumnoExistente == null) {
        console.log("si")
        // Paso 2: Registrar al alumno si no está registrado
      
  
      // Paso 3: Registrar la inscripción (una o varias clases)
      if (crearPaquete) {
        for (let idClase of clasesSeleccionadas) {
          await registroInscripcion({ curp, idClase, fechaInscripcion, acceso: 'activo', horario: horarioSeleccionado });
        }
      } else {
        await registroInscripcion({ curp, idClase, fechaInscripcion, acceso: true, horario: horarioSeleccionado });
      }
  
        // Paso 4: Registrar el pago de inscripción y mensualidad
      const montoTotal = crearPaquete 
      ? clasesSeleccionadas.reduce((acc, idClase) => {
          const clase = clases.find(clase => clase.idClase === idClase);
          return acc + (clase ? clase.costo : 0);
        }, costoInscripcion)
      : costoInscripcion + (clases.find(clase => clase.idClase === idClase)?.costo || 0);

    await registroPago({
      curp,
      fecha_pago: obtenerFechaActual(),
      pago_realizado: obtenerFechaActual(),
      monto: montoTotal,
      estatus: 'completado',
      proximo_pago: proximaFechaPago,
      motivo: 'Inscripción y primera mensualidad'
    });

    // Mensaje de éxito
    setSuccessMessage("Alumno registrado exitosamente con inscripción y pago realizado.");
    // Redirigir al listado de alumnos
    //navigate('/listaAlumnos');
        // Si el alumno ya está registrado, mostrar un mensaje y evitar registrar inscripción y pago
        
        return; // Salir de la función sin registrar inscripción ni pago
      }
   
  
    } catch (error) {
      console.error("Error en el registro:", error);
      setSuccessMessage('');
    }
  };

  return (
    <div className="form-container">
      <Typography variant="h4" gutterBottom className="title">Registro de Alumno</Typography>
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
              label="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre del Tutor"
              value={tutor}
              onChange={(e) => setTutor(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Próxima Fecha de Pago"
              type="date"
              value={proximaFechaPago}
              onChange={(e) => setProximaFechaPago(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox checked={crearPaquete} onChange={handlePaqueteChange} />}
              label="Crear Paquete"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Costo Inscripción"
              type="number"
              value={costoInscripcion}
              onChange={(e) => setCostoInscripcion(e.target.value)}
              required
              fullWidth
              className="text-field"
            />
          </Grid>
          {crearPaquete ? (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Clases</InputLabel>
                <Select
                  multiple
                  value={clasesSeleccionadas}
                  onChange={handleClaseSelection}
                >
                  {clases.map((clase) => (
                    <MenuItem key={clase.idClase} value={clase.idClase}>
                      <Checkbox checked={clasesSeleccionadas.includes(clase.idClase)} />
                      <ListItemText primary={clase.nombre} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Clase</InputLabel>
                <Select
                  value={idClase}
                  onChange={(e) => handleClaseSelection(e)}
                >
                  {clases.map((clase) => (
                    <MenuItem key={clase.idClase} value={clase.idClase}>
                      {clase.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Horario</InputLabel>
              <Select
                value={horarioSeleccionado}
                onChange={handleHorarioSelection}
                disabled={!horario.length}
              >
                {horario.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={loading || loadingPago || loadingInscripcion}>
              {loading || loadingPago || loadingInscripcion ? <CircularProgress size={24} /> : 'Registrar'}
            </Button>
          </Grid>
        </Grid>
      </form>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {error && <Alert severity="error">{"El alumno ya está registrado. No se puede registrar nuevamente."}</Alert>}
      {errorPago && <Alert severity="error">{errorPago.message}</Alert>}
      {errorInscripcion && <Alert severity="error">{errorInscripcion.message}</Alert>}
    </div>
  );
};

export default AlumnoForm;
