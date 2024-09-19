import { useState, useEffect } from 'react';
import { registrarInscripcion, obtenerInscripciones, obtenerInscripcionPorId, obtenerInscripcionPorCurp,actualizarAccesoInscripcion, eliminarInscripcion } from '../services/inscripcionService';

export const useInscripcion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [inscripcion, setInscripcion] = useState(null);

  const registroInscripcion = async (datosInscripciones) => {
    setLoading(true);
    setError(null);
    
    try {
      // Filtrar las inscripciones que ya existen (mismo alumno, misma clase, mismo horario)
      const inscripcionesValidas = await Promise.all(
        datosInscripciones.map(async (inscripcion) => {
          const existeInscripcion = await verificarInscripcionExistente(
            inscripcion.curp, 
            inscripcion.idClase, 
            inscripcion.horario
          );
          
          // Si la inscripción no existe, devolverla para registrarla
          if (!existeInscripcion) {
            return inscripcion;
          }
          
          // Si ya existe una inscripción con el mismo horario, no la agregamos
          return null; 
        })
      );
  
      // Filtrar null (inscripciones duplicadas)
      const inscripcionesParaRegistrar = inscripcionesValidas.filter(inscripcion => inscripcion !== null);
  
      if (inscripcionesParaRegistrar.length === 0) {
        throw new Error('El alumno ya está inscrito en todas las clases seleccionadas con los mismos horarios.');
      }
  
      // Registrar las inscripciones que no son duplicadas
      const response = await registrarInscripcion(inscripcionesParaRegistrar);
  
      if (response.error) {
        throw new Error(response.error);
      }
  
    } catch (err) {
      setError(err.message || 'Error al registrar la inscripción');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  
  const verificarInscripcionExistente = async (curp, idClase, horario) => {
    try {
      const { data, error } = await obtenerInscripciones(); // Obtener todas las inscripciones
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Buscar si existe una inscripción para el mismo alumno, clase y horario
      const inscripcionExistente = data.find(
        inscripcion => 
          inscripcion.curp === curp && 
          inscripcion.idClase === idClase && 
          inscripcion.horario === horario
      );
  
      return inscripcionExistente || null;
    } catch (err) {
      console.error('Error al verificar la inscripción:', err);
      return null;
    }
  };
  
  const listaInscripciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerInscripciones();
      if (response.error) {
        throw new Error(response.error);
      }
      setInscripciones(response.data || []);
    } catch (err) {
      setError('Error al obtener las inscripciones');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const listarInscripcionPorId = async (id) => {
    
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerInscripcionPorId(id);
      
      if (response.error) {
        throw new Error(response.error);
      }
      setInscripcion(response.data || null);
    } catch (err) {
      setError('Error al obtener la inscripción');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const listarInscripcionPorCurp = async (curp) => {
    
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerInscripcionPorCurp(curp);
      
      if (response.error) {
        throw new Error(response.error);
      }
      setInscripcion(response.data || null);
    } catch (err) {
      setError('Error al obtener la inscripción');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

   // Nueva función para actualizar el campo 'acceso'
   const actualizarAcceso = async (curp, idClase, nuevoAcceso) => {
    setLoading(true);
    setError(null);
    try {
      const response = await actualizarAccesoInscripcion(curp, idClase, nuevoAcceso);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Opcional: Actualiza la lista de inscripciones si es necesario
      await listaInscripciones();
      
      return response.data;
    } catch (err) {
      setError('Error al actualizar la inscripción');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarInscripcionPorCurp = async (curp, idClase) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eliminarInscripcion(curp, idClase);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Opcional: Actualiza la lista de inscripciones si es necesario
      await listaInscripciones();
      
      return response.data;
    } catch (err) {
      setError('Error al eliminar la inscripción');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listaInscripciones();
  }, []);

  return { registroInscripcion,eliminarInscripcionPorCurp, listaInscripciones, listarInscripcionPorId,listarInscripcionPorCurp,actualizarAcceso, inscripciones, inscripcion, loading, error };
};
