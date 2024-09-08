import { useState } from 'react';
import { registerStudent } from '../services/alumnoService';

export const useStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (studentData) => {
    setLoading(true);
    try {
      await registerStudent(studentData);
      // Maneja la respuesta, como redirigir al usuario o mostrar un mensaje de éxito
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};