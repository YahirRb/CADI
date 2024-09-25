// src/features/asistencia/hooks/useRegistroAsistencia.js

import { useState } from 'react';
import { registroAsistencia } from '../services/asisteciaSer';

export const useRegistroAsistencia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return { registrarAsistencia, loading, error };
};

export default useRegistroAsistencia;
