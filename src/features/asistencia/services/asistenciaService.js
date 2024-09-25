import axios from 'axios';

// Configura una instancia de axios con la URL base de tu API Django
const apiClient = axios.create({
  //baseURL: 'http://127.0.0.1:8000',
  baseURL: 'https://cadi.onrender.com/', // URL base de tu API Django
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registroAsistencia = async (curp,ids_inscripciones) => {
  try {
    // Realiza una solicitud POST a la API
    console.log(ids_inscripciones)
    const response = await apiClient.post('alumno/asistencia/',{
      curp:curp,
      ids_inscripciones: ids_inscripciones// Enviar el objeto `paquete` en el cuerpo de la solicitud
    }); 
    console.log(response.data)
    // Obtén los datos de la respuesta
    return response.data;
  } catch (error) {
    // Maneja errores
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const listarInscripciones = async () => {
  try {
    // Realiza una solicitud GET a la API
    const response = await apiClient.get('/alumno/inscripcionesAcceso/');
    
    // Obtén los datos de la respuesta
    return response.data;
  } catch (error) {
    // Maneja errores
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const guardarFotoAlumno = async (curp, foto) => {
  try {
    // Crea un objeto FormData para enviar la foto
    const formData = new FormData();
    formData.append('curp', curp);
    formData.append('foto', foto);

    // Realiza una solicitud POST a la API
    const response = await apiClient.post('alumno/enviarFoto/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Asegúrate de que el tipo de contenido sea correcto
      },
    });

    // Obtén los datos de la respuesta
    return response.data;
  } catch (error) {
    // Maneja errores
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener la URL de la foto de un alumno por su CURP
export const obtenerFotoAlumno = async (curp) => {
  try {
    // Realiza una solicitud GET a la API enviando la CURP como parámetro
    const response = await apiClient.get('/alumno/foto/', {
      params: {
        curp: curp, // Enviar el CURP como parámetro en la solicitud GET
      },
    }); 
    console.log(response.data)
    // Retorna la URL de la foto del alumno
    return response.data;
  } catch (error) {
    // Maneja errores
    console.error('Error al obtener la foto del alumno:', error.response ? error.response.data : error.message);
    throw error;
  }
};