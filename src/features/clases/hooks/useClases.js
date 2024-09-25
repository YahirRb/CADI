import { useState, useEffect } from 'react';
import { registrarClase,obtenerClases,obtenerClasesAlumno } from '../services/claseService'; // Define el servicio para registrar clases

export const useClase = () => {
  const [clases, setClases] = useState([]);
  const [clasesAlumno, setClasesAlumno] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registroClase = async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log(data)
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
  const fetchClasesPorCURP = async (curp) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await obtenerClasesAlumno(curp);
      if (error) {
        throw new Error(error);
      }
      setClasesAlumno(data); // Almacena las clases obtenidas
    } catch (err) {
      setError('Error al obtener las clases del alumno');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar las clases cuando el componente se monta
  useEffect(() => {
    fetchClases();
  }, []);

  return { clases,clasesAlumno, registroClase,fetchClases,fetchClasesPorCURP, loading, error };
};