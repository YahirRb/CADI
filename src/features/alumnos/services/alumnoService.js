/*
import  supabase   from '../../../supabaseClient';

export const resgistroAlumno = async (datosAlumno) => {
  try {
    const { data, error } = await supabase
      .from('Alumnos')
      .insert([datosAlumno]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


export const listarAlumnos = async () => {
  try {
    const { data, error } = await supabase
      .from('Alumnos') // Nombre de tu tabla
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
  
};

export const buscarAlumnoPorCurp = async (curp) => {
  try {
    const { data, error, count } = await supabase
      .from('Alumnos')
      .select('*', { count: 'exact' }) // Asegúrate de recibir el conteo de resultados
      .eq('curp', curp);

    if (error) throw error;

    // Verifica si hay resultados
    if (data.length > 1) {
      throw new Error('Se encontraron múltiples alumnos con el mismo CURP.');
    }

    // Devuelve el primer resultado o null si no hay resultados
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    throw new Error(error.message);
  }
};
*/

import axios from 'axios';

// Configura una instancia de axios con la URL base de tu API Django
const apiClient = axios.create({
  //baseURL: 'http://127.0.0.1:8000',
  baseURL: 'https://cadi.onrender.com/', // URL base de tu API Django
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registroAlumno = async (alumno,pago,inscripcion) => {
  try {
     
    console.log(pago)
    // Realiza una solicitud POST a la API
    const response = await apiClient.post('alumno/registrar/', {
      alumno: alumno,
      pago: pago,
      inscripciones: inscripcion // Esto debe ser un array
    });
    
    // Obtén los datos de la respuesta
    return response.data;
  } catch (error) {
    // Maneja errores
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Lista todos los alumnos
export const listarAlumnos = async () => {
  try {
    const response = await apiClient.get('/alumno/alumnos/'); // Ajusta el endpoint según tu configuración
 
    return response.data;
    
  } catch (error) {
    console.error('Error al listar alumnos:', error.message);
    throw new Error(error.message);
  }
};

// Busca un alumno por CURP
export const buscarAlumnoPorCurp = async (curp) => {
  try {
    const response = await apiClient.get(`/alumno/buscarCurp/`, {
      params: { curp:curp }, // Envía el CURP como parámetro de consulta
    }); 
    
    const data = response.data;
    
    // Verifica si hay múltiples resultados
    console.log(data)

    return data
  } catch (error) {
    console.error('Error al buscar alumno por CURP:', error.message);
    throw new Error(error.message);
  }
};
