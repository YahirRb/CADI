import { useState } from 'react';
import { registrarProfesor } from '../services/profesorService';

export const useProfesor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registroProfesor = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await registrarProfesor(data);
      // Maneja la respuesta o realiza alguna acción adicional aquí
    } catch (err) {
      setError('Error al registrar el profesor');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return { registroProfesor, loading, error };
};