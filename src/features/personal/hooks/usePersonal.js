import { useState } from 'react';
import { registrarPersonal } from '../services/personalService'; // Define el servicio para registrar inscripciones

export const usePersonal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registroPersonal = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await registrarPersonal(data);
    } catch (err) {
      setError('Error al registrar');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return { registroPersonal, loading, error };
};