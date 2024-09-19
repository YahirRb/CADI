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
import DeleteIcon from '@mui/icons-material/Delete';
import './paqueteForm.css' // Icono de eliminar

const EditarPaquete = () => {
  const [nombre, setNombre] = useState('');
  const { curp } = useParams(); // Obtener CURP desde la URL
  const [descripcion, setDescripcion] = useState('');
  const [precioTotal, setPrecioTotal] = useState(0.0);
  const [clasesSeleccionadas, setClasesSeleccionadas] = useState([]);
  const { registroPaquete,eliminarClasePaquete,loading: loadingPaquete, error: errorPaquete, success } = usePaquete();
  const { listarInscripcionPorCurp,actualizarAcceso,eliminarInscripcionPorCurp,registroInscripcion, inscripciones, loading: loadingInscripcion, error: errorInscripcion } = useInscripcion();
  const { clases, loading: loadingClases, error: errorClases } = useClase();
  const { listaPagosPorCurp,registroPago, alumno, loading: loadingPagos, pagos } = usePagos();
  const [ultimoPago, setUltimoPago] = useState(null); // Hook para obtener datos del alumno
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredClases, setFilteredClases] = useState(clases || []);
  const [clasesEliminadas, setClasesEliminadas]=useState([]); // Inicializar filteredClases

  useEffect(() => {
    const fetchData = async () => {
      if (curp) {
        await listaPagosPorCurp(curp); // Obtener lista de pagos
        await listarInscripcionPorCurp(curp); // Obtener inscripciones por CURP
      }
    };

    fetchData();
  }, [curp]);

  useEffect(() => {
    if (pagos && pagos.length > 0) {
      const ultimo = pagos.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago))[0];
      setUltimoPago(ultimo);
    }
  }, [pagos]);

  useEffect(() => {
    if (inscripciones && clases) {
      const inscripcionesConAcceso = inscripciones.filter(ins => ins.acceso);
      console.log(inscripcionesConAcceso)
      const clasesSeleccionadas = inscripcionesConAcceso.map(ins => {
        const clase = clases.find(c => c.idClase === ins.idClase );
        return {
          idClase: clase?.idClase || '',
          horario: ins.horario || '',
          fechaPago: ultimoPago?.fecha_pago || ''
        };
      });
      setClasesSeleccionadas(clasesSeleccionadas);
    }
  }, [inscripciones, clases, ultimoPago]);

  useEffect(() => {
    if (clases) {
      setFilteredClases(clases); // Actualiza filteredClases cuando clases cambie
    }
  }, [clases]);

  useEffect(() => {
    if (clasesSeleccionadas.length > 0) {
      const descripcionActualizada = clasesSeleccionadas
        .map((clase) => {
          const horarios = getHorariosDeClase(clase.idClase).join(', ');
          return `Clase: ${clase.idClase}, Horarios: ${horarios}`;
        })
        .join(' | ');

      const horarioInscripcion = clasesSeleccionadas[0]?.horario || ''; 
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
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Registrar el paquete
      const paquete = {
        nombre: "ejemplo", // Puedes ajustar este campo
        precio_total: precioTotal,
        curp: alumno.curp
      };
      await eliminarClasePaquete(clasesEliminadas,curp)
      //await actualizarAcceso(curp, clasesEliminadas,false)
      await eliminarInscripcionPorCurp(curp, clasesEliminadas)
      await registroPaquete(paquete, clasesSeleccionadas);
      
      // Registrar cada pago individualmente
      if (alumno && clasesSeleccionadas.length > 0) {
        for (const clase of clasesSeleccionadas) {
          if (clase.fechaPago) {
            const proximoPago = sumarUnMes(clase.fechaPago);

            const nuevoPago = {
              curp: alumno.curp,
              monto: parseFloat(precioTotal) / clasesSeleccionadas.length,
              fecha_pago: clase.fechaPago,
              pago_realizado: "2024-02-01",
              proximo_pago: proximoPago,
              estatus: 'pendiente',
              motivo: 'Paquete'
            };
            await registroPago(nuevoPago);
          }
        }

        // Crear inscripciones
        const datosInscripciones = clasesSeleccionadas.map(clase => ({
          curp: alumno.curp,
          idClase: clase.idClase,
          fechaInscripcion: new Date().toISOString().split('T')[0],
          acceso: true,
          horario: clase.horario
        }));

        await registroInscripcion(datosInscripciones);

        setSuccessMessage('Paquete y pagos registrados exitosamente.');
      } else {
        setErrorMessage('No se encontró información del alumno o no se han seleccionado clases.');
        return;
      }
    } catch (error) {
      setErrorMessage('Error al registrar el paquete o los pagos.');
    }
  };

  const agregarClase = () => {
    setClasesSeleccionadas([...clasesSeleccionadas, { idClase: '', horario: '', fechaPago: ultimoPago?.fecha_pago || '' }]);
  };

  const eliminarClase = (index) => {
    const claseEliminada = clasesSeleccionadas[index];
    
    if (claseEliminada.idClase) {
      console.log(`Clase eliminada: ${claseEliminada.idClase}`); // Imprimir en consola el ID de la clase eliminada
      
      // Agregar el ID de la clase eliminada al array de clases eliminadas solo si tiene un idClase
      setClasesEliminadas(prevClasesEliminadas => [
        ...prevClasesEliminadas,
        claseEliminada.idClase
      ]);
    } else {
      console.log('No se puede eliminar una clase sin idClase.');
    }
    
    // Actualizar las clases seleccionadas
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
                  value={clase.idClase}
                  onChange={(e) => handleClaseChange(index, 'idClase', e.target.value)}
                >
                  {filteredClases.map((clase) => (
                    <MenuItem key={clase.idClase} value={clase.idClase}>
                      {clase.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  fullWidth
                  label="Horario"
                  value={clase.horario}
                  onChange={(e) => handleClaseChange(index, 'horario', e.target.value)}
                  disabled={!clase.idClase}
                >
                  {getHorariosDeClase(clase.idClase).map((horario) => (
                    <MenuItem key={horario} value={horario}>
                      {horario}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <IconButton
                  color="secondary"
                  aria-label="Eliminar"
                  onClick={() => eliminarClase(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12} className="buttonContainer" style={{ textAlign: 'center', marginTop: '20px' }}>
            <button type="button" className="button" onClick={agregarClase}>
              Agregar Clase
            </button>
          </Grid>

        <div style={{ marginTop: '20px' }}>
          <p><strong>Precio Total:</strong> ${precioTotal}</p>
        </div>

        <Grid item xs={12} className="buttonContainer" style={{ textAlign: 'center', marginTop: '20px' }}>
            <button type="submit" className="button" disabled={loadingPaquete}>
              {loadingPaquete ? <CircularProgress size={24} className="spinner" /> : 'Guardar Paquete'}
            </button>
          </Grid>
      </form>
    </div>
  );
};

export default EditarPaquete;
