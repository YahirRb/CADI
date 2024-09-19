import { useState,useEffect } from 'react';
import { resgistroAlumno,listarAlumnos, buscarAlumnoPorCurp } from '../services/alumnoService';

export const useStudent = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registro = async (datosAlumno) => {
    setLoading(true);
    try {
      await resgistroAlumno(datosAlumno); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const listaAlumnos = async () => {
    try {
      const data = await listarAlumnos();
      setAlumnos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const buscarAlumno = async (curp) => {
    setLoading(true);
    try {
      const alumno = await buscarAlumnoPorCurp(curp);
      return alumno;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listaAlumnos(); // Cargar alumnos al montar el componente
  }, []); 
  return { alumnos,listaAlumnos,registro,buscarAlumno, loading, error };

};
