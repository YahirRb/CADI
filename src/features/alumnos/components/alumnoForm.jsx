import { useState, useEffect } from 'react';
import usePagos from '../../pagos/hooks/usePagos';
import { useStudent } from '../hooks/useAlumno';
import { useInscripcion } from '../../inscripcion/hooks/useInscripcion';
import { useClase } from '../../clases/hooks/useClases';
import './alumnoForm.css';
import { Grid, TextField, Button, Typography, CircularProgress, Alert, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const AlumnoForm = () => {
  const [curp, setCurp] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tutor, setTutor] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [idClase, setIdClase] = useState('');
  const [fechaInscripcion, setFechaInscripcion] = useState('');
  const [costoInscripcion, setCostoInscripcion] = useState(500); // Valor predeterminado
  const [proximaFechaPago, setProximaFechaPago] = useState('');
  const [costoClase, setCostoClase] = useState(0);
  const [crearPaquete, setCrearPaquete] = useState(false);
  const [clasesSeleccionadas, setClasesSeleccionadas] = useState([]);
  const [dias, setDias] = useState([]);
  const [horario, setHorario] = useState([]);
  const [turno, setTurno] = useState('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [total, setTotal] = useState(0); // Estado para el total

  const [clasesIngresadas, setClasesIngresadas] = useState([]); // 
  const { pagos, registroPago, loadingPago, errorPago } = usePagos();
  const { clases, registroClase, loadingClase, errorClase } = useClase();
  const { registro, buscarAlumno, loading, error } = useStudent();
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

  const agregarClase = () => {
    setClasesIngresadas(prev => [...prev, { idClase: '', horario: '' }]);
  };

  const manejarCambioClase = (index, campo, valor) => {
    const nuevasClases = [...clasesIngresadas];
    nuevasClases[index][campo] = valor;
    setClasesIngresadas(nuevasClases);
  };

  const calcularTotal = () => {
    const costoTotal = clasesIngresadas.reduce((acc, clase) => {
      const claseEncontrada = clases.find(c => c.idClase === clase.idClase);
      return acc + (claseEncontrada ? claseEncontrada.costo : 0);
    }, 0); // Comienza desde 0 para solo sumar los costos de las clases
  
    // Sumar el costo de inscripción al costo total de las clases
    setTotal(costoTotal + Number(costoInscripcion)); // Asegúrate de convertirlo a número
  };
  

  useEffect(() => {
    console.log("dd")
    calcularTotal();
  }, [clasesIngresadas, costoInscripcion]);
  

  useEffect(() => {
    const fechaActual = obtenerFechaActual();
    setFechaInscripcion(fechaActual);
    setProximaFechaPago(calcularProximaFechaPago(fechaActual));

    if (!crearPaquete && idClase) {
      const claseSeleccionada = clases.find(clase => clase.idClase === idClase);
      if (claseSeleccionada) {
        setCostoClase(claseSeleccionada.costo);
        setDias(claseSeleccionada.dias);
        setHorario(claseSeleccionada.horario || []);
        setTurno(claseSeleccionada.turno);
      }
    } else if (crearPaquete && clasesSeleccionadas.length > 0) {
      const costoTotalPaquete = clasesSeleccionadas.reduce((acc, idClase) => {
        const clase = clases.find(clase => clase.idClase === idClase);
        return acc + (clase ? clase.costo : 0);
      }, costoInscripcion);
      console.log(`Costo Total del Paquete: ${costoTotalPaquete}`);
      setTotal(costoTotalPaquete); // Actualiza el total del paquete
    }
  }, [idClase, crearPaquete, clases, costoInscripcion, clasesSeleccionadas]);

  useEffect(() => {
    // Calcula el total cada vez que cambian los costos
    console.log(clases)
    const montoTotal = crearPaquete
      ? clasesSeleccionadas.reduce((acc, idClase) => {
          const clase = clases.find(clase => clase.idClase === idClase);
          return acc + (clase ? clase.costo : 0);
        }, costoInscripcion)
      : costoInscripcion + (clases.find(clase => clase.idClase === idClase)?.costo || 0);
    
    setTotal(montoTotal); // Actualiza el total
  }, [crearPaquete, clasesSeleccionadas, costoInscripcion, idClase, clases]);

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
      setHorario(selectedClass?.horario || []);
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
    const clasesValidas = clasesIngresadas.every(clase => clase.idClase && clase.horario);
    if (!clasesValidas) {
      alert("Por favor, asegúrate de que todas las clases tengan una clase y un horario seleccionados.");
      return; // No enviar el formulario
    }
  
    try {
      const montoTotal = costoInscripcion + clasesIngresadas.reduce((acc, clase) => {
        const claseEncontrada = clases.find(c => c.idClase === clase.idClase);
        return acc + (claseEncontrada ? claseEncontrada.costo : 0);
      }, 0);
  
      const alumno = {
        curp,
        nombre,
        apellidos,
        tutor,
        correo,
        telefono,
        fechaNacimiento
      };
  
      // Modificar inscripcion para que sea un array
      const inscripciones = clasesIngresadas.map(clase => ({
        idClase: clase.idClase,
        fechaInscripcion,
        acceso: true,
        horario: clase.horario
      }));
  
      const pago = {
        fecha_pago: obtenerFechaActual(),
        pago_realizado: obtenerFechaActual(),
        monto: montoTotal,
        estatus: 'completado',
        proximo_pago: proximaFechaPago,
        motivo: 'Inscripción y primera mensualidad'
      };
  
      // Imprimir los datos que se enviarán
      console.log("Datos a enviar:", {montoTotal});

      // Llamar a la función de registro con el objeto estructurado
      const resultado = await registro(alumno, pago, inscripciones);
      // Maneja el resultado según lo necesites, por ejemplo, redireccionar o mostrar un mensaje de éxito
  
    } catch (error) {
      console.error("Error en el registro:", error);
      setSuccessMessage('');
    }
  };
  
  

  const eliminarClase = (index) => {
    setClasesIngresadas(prev => prev.filter((_, i) => i !== index));
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
          <TextField
  label="Costo Inscripción"
  type="number"
  value={costoInscripcion}
  onChange={(e) => setCostoInscripcion(Number(e.target.value))} // Convierte a número
  required
  fullWidth
  className="text-field"
/>
          </Grid>
          

          {clasesIngresadas.map((clase, index) => (
  <Grid item xs={10} key={index} container spacing={2} alignItems="center">
    <Grid item xs={6}>
      <FormControl fullWidth>
        <InputLabel>Clase</InputLabel>
        <Select
        value={clase.idClase}
        onChange={(e) => manejarCambioClase(index, 'idClase', e.target.value)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200, // Altura máxima para el menú desplegable
              overflowY: 'auto', // Habilitar scroll vertical
            },
          },
        }}
      >
        {clases.map(c => (
          <MenuItem
            key={c.idClase}
            value={c.idClase}
            disabled={clasesIngresadas.some(ca => ca.idClase === c.idClase && ca.idClase !== clase.idClase)}
          >
            {c.nombre} - ${c.costo}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
    </Grid>
    <Grid item xs={4}>
      <FormControl fullWidth>
        <InputLabel>Horario</InputLabel>
        <Select
          value={clase.horario}
          onChange={(e) => manejarCambioClase(index, 'horario', e.target.value)}
          disabled={!clase.idClase}
        >
          {clase.idClase && clases.find(c => c.idClase === clase.idClase)?.horario.map(hora => (
            <MenuItem key={hora} value={hora}>
              {hora}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={2}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => eliminarClase(index)}
        startIcon={<DeleteIcon />}
        sx={{ color: 'red', borderColor: 'red' }}
      />
    </Grid>
  </Grid>
))}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={agregarClase}>
              Agregar Clase
            </Button>
          </Grid>
          

          <Grid item xs={12} sm={6}>
            <TextField
              label="Total"
              type="number"
              value={total}
              disabled
              fullWidth
              className="text-field"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={loading || loadingPago }>
              {loading || loadingPago ? <CircularProgress size={24} /> : 'Registrar'}
            </Button>
          </Grid>
        </Grid>
      </form>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {error && <Alert severity="error">{"El alumno ya está registrado. No se puede registrar nuevamente."}</Alert>}
      {errorPago && <Alert severity="error">{errorPago.message}</Alert>} 
    </div>
  );
};

export default AlumnoForm;
