import { useState } from 'react';
import { resgistroAsistencia } from '../services/asistenciaService';

export const useAsistencia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registro = async (datosAsistencia) => {
    setLoading(true);
    try {
      await resgistroAsistencia(datosAsistencia);
      console.log('Asistencia registrada:', datosAsistencia);
      // Maneja la respuesta, como redirigir al usuario o mostrar un mensaje de éxito
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { registro, loading, error };
};