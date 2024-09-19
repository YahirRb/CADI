import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePaquete } from '../hooks/usePaqueteClase';
import { useClase } from '../../clases/hooks/useClases';
import { useInscripcion } from '../../inscripcion/hooks/useInscripcion';
import usePagos from '../../pagos/hooks/usePagos'; // Importa el hook de pagos
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'; // Icono de eliminar

const PaqueteForm = () => {
  const [nombre, setNombre] = useState('');
  const { idClase, curp } = useParams(); // Obtener CURP desde la URL
  const [descripcion, setDescripcion] = useState('');
  const [precioTotal, setPrecioTotal] = useState(0.0);
  const [clasesSeleccionadas, setClasesSeleccionadas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClases, setFilteredClases] = useState([]);
  const { registroPaquete, loading: loadingPaquete, error: errorPaquete, success } = usePaquete();
  const { listarInscripcionPorId,registroInscripcion, inscripcion, loading: loadingInscripcion, error: errorInscripcion } = useInscripcion();
  const { clases, loading: loadingClases, error: errorClases } = useClase();
  const { listaPagosPorCurp, registroPago, alumno, loading: loadingPagos, pagos } = usePagos();
  const [ultimoPago, setUltimoPago] = useState(null); // Hook para obtener datos del alumno
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (curp) {
        await listaPagosPorCurp(curp); // Obtener lista de pagos
      }
      if (idClase) {
        await listarInscripcionPorId(idClase);
      }
    };

    fetchData();
  }, [curp, idClase]); // Ejecuta solo cuando `curp` o `idClase` cambien
  
  useEffect(() => {
    if (pagos && pagos.length > 0) {
      const ultimo = pagos.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago))[0];
      console.log("Último pago encontrado:", ultimo); // Verificar si el último pago es correcto
      setUltimoPago(ultimo);
    }
  }, [pagos]);

  useEffect(() => {
    if (inscripcion && clases) {
      const claseSeleccionada = clases.find(clase => clase.idClase === inscripcion.idClase);
      if (claseSeleccionada) {
        setNombre(claseSeleccionada.nombre || '');
        setPrecioTotal(claseSeleccionada.precio || 0.0);
        setClasesSeleccionadas([{ idClase: claseSeleccionada.idClase || '', horario: inscripcion.horario || '', fechaPago: ultimoPago?.fecha_pago || '' }]);
      }
    }
  }, [inscripcion, clases, ultimoPago]);

  useEffect(() => {
    if (clasesSeleccionadas.length > 0) {
      const descripcionActualizada = clasesSeleccionadas
        .map((clase) => {
          const horarios = getHorariosDeClase(clase.idClase).join(', ');
          return `Clase: ${clase.idClase}, Horarios: ${horarios}`;
        })
        .join(' | ');
      
      const horarioInscripcion = clasesSeleccionadas[0]?.horario || '';
      setDescripcion(`${descripcionActualizada} | Horario de Inscripción: ${horarioInscripcion}`);
    }
  }, [clasesSeleccionadas]);

  useEffect(() => {
    const nuevoPrecioTotal = clasesSeleccionadas.reduce((total, clase) => {
      const claseSeleccionada = clases.find(c => c.idClase === clase.idClase);
      return total + (claseSeleccionada?.costo || 0);
    }, 0);

    setPrecioTotal(nuevoPrecioTotal);
  }, [clasesSeleccionadas, clases]);
  const sumarUnMes = (fecha) => {
    const date = new Date(fecha);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0]; // Retornar en formato YYYY-MM-DD
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Limpiar mensaje de éxito anterior
    setErrorMessage(''); // Limpiar mensaje de error anterior
    
    try {
      // Registrar el paquete
      const paquete = {
        nombre: "ejemplo",
        precio_total: precioTotal,
        curp:alumno.curp
      };
      await registroPaquete(paquete, clasesSeleccionadas);
  
      // Registrar cada pago individualmente
      if (alumno && clasesSeleccionadas.length > 0) {
        for (const clase of clasesSeleccionadas) {
          if (clase.fechaPago) {
            const proximoPago = sumarUnMes(clase.fechaPago);
  
            const nuevoPago = {
              curp: alumno.curp,
              monto: parseFloat(precioTotal) / clasesSeleccionadas.length, // Dividir el monto total entre el número de clases
              fecha_pago: clase.fechaPago, 
              pago_realizado:"2024-02-01",// Usar la fecha de pago de cada clase
              proximo_pago: proximoPago, // Guardar la fecha del próximo pago
              estatus: 'pendiente',
              motivo:'Paquete' // O el estado que necesites
            };
            //await registroPago(nuevoPago);
          }
        }
        // Crear inscripciones
        const datosInscripciones = clasesSeleccionadas.map(clase => ({
          curp: alumno.curp,
          idClase: clase.idClase,
          fechaInscripcion: new Date().toISOString().split('T')[0], // Fecha actual
          acceso: true,
          horario: clase.horario // Asegúrate de que el horario esté disponible
        }));
        
        // Envía directamente la lista de inscripciones, ya es un array
        await registroInscripcion(datosInscripciones);

        setSuccessMessage('Paquete y pagos registrados exitosamente.');
      } else {
        console.error('No se encontró información del alumno o no se han seleccionado clases.');
        setErrorMessage('No se encontró información del alumno o no se han seleccionado clases.');
        return;
      }
    } catch (error) {
      console.error('Error al registrar el paquete o los pagos:', error);
      setErrorMessage('Error al registrar el paquete o los pagos.');
    }
  };

  const agregarClase = () => {
    setClasesSeleccionadas([...clasesSeleccionadas, { idClase: '', horario: '', fechaPago: ultimoPago?.fecha_pago || '' }]);
  };

  const eliminarClase = (index) => {
    const nuevasClases = clasesSeleccionadas.filter((_, i) => i !== index);
    setClasesSeleccionadas(nuevasClases);
  };

  const handleClaseChange = (index, field, value) => {
    const updatedClases = [...clasesSeleccionadas];
    updatedClases[index][field] = value;
    if (field === 'idClase') {
      updatedClases[index]['horario'] = ''; // Reiniciar horario si cambias la clase
      updatedClases[index]['fechaPago'] = ultimoPago?.fecha_pago || ''; // Reiniciar fecha de pago si cambias la clase
    }
    setClasesSeleccionadas(updatedClases);
  };

  const getHorariosDeClase = (claseId) => {
    const clase = clases?.find((c) => c.idClase === claseId);
    return clase ? clase.horario || [] : [];
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (clases) {
      setFilteredClases(
        clases.filter(clase =>
          (clase.nombre?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [clases, searchQuery]);

  if (loadingClases || loadingInscripcion || loadingPagos) {
    return <CircularProgress />;
  }

  return (
    <div className="form-container">
      <h2 className="title">Registrar Paquete</h2>
      
      {/* Mostrar datos del alumno */}
      <div>
        <p><strong>Nombre del Alumno:</strong> {alumno?.nombre || 'No disponible'}</p>
        <p><strong>CURP:</strong> {alumno?.curp || 'No disponible'}</p>
      </div>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <Grid container>
           

          {clasesSeleccionadas.map((clase, index) => (
            <Grid container spacing={2} key={index} style={{ marginTop: '20px' }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  fullWidth
                  label="Clase"
                  value={clase.idClase || ''}
                  onChange={(e) => handleClaseChange(index, 'idClase', e.target.value)}
                  variant="outlined"
                  className="text-field"
                  disabled={loadingClases}
                >
                  {filteredClases.map((clase) => (
                    <MenuItem key={clase.idClase} value={clase.idClase}>
                      {clase.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  fullWidth
                  label="Horario"
                  value={clase.horario || ''}
                  onChange={(e) => handleClaseChange(index, 'horario', e.target.value)}
                  variant="outlined"
                  className="text-field"
                  disabled={loadingClases}
                >
                  {getHorariosDeClase(clase.idClase).map((horario, idx) => (
                    <MenuItem key={idx} value={horario}>
                      {horario}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Fecha de Pago"
                  type="date"
                  value={clase.fechaPago || ''}
                  onChange={(e) => handleClaseChange(index, 'fechaPago', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  className="text-field"
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton
                  aria-label="eliminar"
                  onClick={() => eliminarClase(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <TextField
              fullWidth
              label="Monto del Pago"
              type="number"
              value={precioTotal || ''}
              onChange={(e) => setPrecioTotal(e.target.value)}
              variant="outlined"
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} className="buttonContainer" style={{ textAlign: 'center', marginTop: '20px' }}>
            <button type="button" className="button" onClick={agregarClase}>
              Agregar Clase
            </button>
          </Grid>

          <Grid item xs={12} className="buttonContainer" style={{ textAlign: 'center', marginTop: '20px' }}>
            <button type="submit" className="button" disabled={loadingPaquete}>
              {loadingPaquete ? <CircularProgress size={24} className="spinner" /> : 'Registrar Paquete'}
            </button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default PaqueteForm;
