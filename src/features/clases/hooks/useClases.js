import { useState, useEffect } from 'react';
import { registrarClase,obtenerClases } from '../services/claseService'; // Define el servicio para registrar clases

export const useClase = () => {
  const [clases, setClases] = useState([]);
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
  const fetchClases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerClases();
      setClases(data);
    } catch (err) {
      setError('Error al obtener las clases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar las clases cuando el componente se monta
  useEffect(() => {
    fetchClases();
  }, []);

  return { clases, registroClase,fetchClases, loading, error };
};