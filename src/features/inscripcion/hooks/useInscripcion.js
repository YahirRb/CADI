import { useState } from 'react';
import { registrarInscripcion } from '../services/inscripcionService'; // Define el servicio para registrar inscripciones

export const useInscripcion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registroInscripcion = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await registrarInscripcion(data);
      // Maneja la respuesta o realiza alguna acción adicional aquí
    } catch (err) {
      setError('Error al registrar la inscripción');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return { registroInscripcion, loading, error };
};