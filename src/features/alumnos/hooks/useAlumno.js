import { useState } from 'react';
import { resgistroAlumno } from '../services/alumnoService';

export const useStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registro = async (datosAlumno) => {
    setLoading(true);
    try {
      await resgistroAlumno(datosAlumno);
      // Maneja la respuesta, como redirigir al usuario o mostrar un mensaje de éxito
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { registro, loading, error };
};