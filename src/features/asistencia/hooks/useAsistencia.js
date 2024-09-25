// src/features/asistencia/hooks/useRegistroAsistencia.js

import { useState,useEffect } from 'react';
import { registroAsistencia, listarInscripciones,guardarFotoAlumno,  obtenerFotoAlumno   } from '../services/asistenciaService';

export const useRegistroAsistencia = () => {

  const [inscripciones, setInscripciones] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fotoUrl, setFotoUrl] = useState('');

  const registrarAsistencia = async (curp, ids_inscripciones) => {
    setLoading(true);
    setError(null);

    try {
      const data = await registroAsistencia(curp, ids_inscripciones); 
      return data; // Retorna los datos recibidos
    } catch (err) {
      setError(err);
      throw err; // Re-lanza el error para manejarlo en el componente
    } finally {
      setLoading(false);
    }
  };

  const fetchInscripciones = async () => {
    setLoading(true);
    setError(null); // Resetea el error al iniciar la carga
    try {
      const data = await listarInscripciones();
      setInscripciones(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const registrarFoto = async (curp, foto) => {
    setLoading(true);
    setError(null);

    try {
      const data = await guardarFotoAlumno(curp, foto);
      return data; // Retorna los datos recibidos
    } catch (err) {
      setError(err);
      throw err; // Re-lanza el error para manejarlo en el componente
    } finally {
      setLoading(false);
    }
  };


  const obtenerFoto = async (curp) => {
    setLoading(true);
    setError(null);

    try {
      const fotoUrl = await obtenerFotoAlumno(curp);
      setFotoUrl(fotoUrl); // Almacena la URL de la foto en el estado 
      return fotoUrl;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInscripciones();
  }, []);

  return { registrarAsistencia,registrarFoto,obtenerFoto,fotoUrl,inscripciones, loading, error };
};

export default useRegistroAsistencia;
