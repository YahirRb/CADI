import { useState } from 'react';
import { registrarClase } from '../services/claseService'; // Define el servicio para registrar clases

export const useClase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registroClase = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await registrarClase(data);
      // Maneja la respuesta o realiza alguna acción adicional aquí
    } catch (err) {
      setError('Error al registrar la clase');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return { registroClase, loading, error };
};