import axios from 'axios';

// Configura una instancia de axios con la URL base de tu API Django
const apiClient = axios.create({
  //baseURL: 'http://127.0.0.1:8000', // URL base de tu API Django
  baseURL: 'https://cadi.onrender.com/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registroAsistencia = async (curp,ids_inscripciones) => {
  try {
    // Realiza una solicitud POST a la API
    const response = await apiClient.post('alumno/asistencia/',{
      curp:curp,
      ids_inscripciones: ids_inscripciones// Enviar el objeto `paquete` en el cuerpo de la solicitud
    }); 
    
    // Obtén los datos de la respuesta
    return response.data;
  } catch (error) {
    // Maneja errores
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};
