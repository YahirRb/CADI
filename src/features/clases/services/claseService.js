/*import supabase from '../../../supabaseClient'; // Ajusta la ruta según tu estructura

export const registrarClase = async (datosClase) => {
  try {
    const { data, error } = await supabase
      .from('Clase') // Asegúrate de que el nombre de la tabla sea correcto
      .insert([datosClase]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const obtenerClases = async () => {
  try {
    const { data, error } = await supabase
      .from('Clase')
      .select('idClase, nombre,costo, dias, horario, turno'); // Selecciona los campos que necesitas
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
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

// Función para registrar una nueva clase
export const registrarClase = async (datosClase) => {
  try {
    const response = await apiClient.post('/clase/registrar/', {
      paquete: datosClase
    }); // Ajusta el endpoint según tu configuración
    return response.data;
  } catch (error) {
    console.error('Error al registrar la clase:', error.message);
    throw new Error(error.message);
  }
};

// Función para obtener todas las clases
export const obtenerClases = async () => {
  try {
    const response = await apiClient.get('/clase/listarClases/'); // Ajusta el endpoint según tu configuración
    return response.data;
  } catch (error) {
    console.error('Error al obtener las clases:', error.message);
    throw new Error(error.message);
  }
};

export const obtenerClasesAlumno = async (curp) => {
  try {
    console.log(curp)
    const response = await apiClient.get('/clase/clasesAlumno/', {
      params: {
        curp: curp
      }
    }); // Ajusta el endpoint según tu configuración

    console.log('Datos recibidos:', response.data);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error:', error.message);
    return { data: null, error: error.message };
  }
};