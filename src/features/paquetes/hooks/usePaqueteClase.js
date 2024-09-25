import { useState,useEffect } from 'react';
// usePaqueteClase.js
import { registrarPaquete, registrarPaqueteClases,listarTodosLosPaquetes,eliminarClaseDelPaquete} from '../services/paqueteService';

export const usePaquete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paquetes, setPaquetes] = useState([]);
//camboar esto
  const registroPaquete = async (paquete, clasesSeleccionadas,listaPagos,datosInscripciones) => {
    setLoading(true);
    setError(null);

    try {
      // Primero registrar el paquete
      const paqueteRegistrado = await registrarPaquete(paquete, clasesSeleccionadas,listaPagos,datosInscripciones);

      
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error desconocido');
      setSuccess(false);
      console.error('Error al registrar el paquete:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarPaquetes = async () => {
    setLoading(true);
    setError(null);

    try {
      const paquetesListados = await listarTodosLosPaquetes();
      setPaquetes(paquetesListados.data || []);
    } catch (err) {
      setError(err.message || 'Error desconocido');
      console.error('Error al cargar paquetes:', err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarClasePaquete = async (idClase, curp) => {
    setLoading(true);
    setError(null);

    try {
      // Llamada al servicio para eliminar la clase del paquete
      await eliminarClaseDelPaquete(idClase, curp);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error desconocido');
      setSuccess(false);
      console.error('Error al eliminar la clase del paquete:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar paquetes al montar el hook
  useEffect(() => {
    cargarPaquetes();
  }, []);

  return { registroPaquete, cargarPaquetes, eliminarClasePaquete,paquetes, loading, error, success };
};