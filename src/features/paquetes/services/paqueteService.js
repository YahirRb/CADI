/*import supabase from '../../../supabaseClient';

// paqueteService.js

// Función para verificar si un paquete ya existe por CURP
export const verificarPaquetePorCurp = async (curp) => {
  try {
    const { data, error } = await supabase
      .from('Paquete')
      .select('idPaquete')
      .eq('curp', curp)
      .single();  // Asegura que solo se devuelva un único registro

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message || 'Error al verificar el paquete');
    }

    // Retorna el ID del paquete si existe
    return data ? data.idPaquete : null;
  } catch (err) {
    console.error('Error capturado en verificarPaquetePorCurp:', err);
    throw err;
  }
};

// Función para registrar un nuevo paquete
export const registrarPaquete = async (paquete) => {
  try {
    // Primero, verifica si ya existe un paquete para la CURP dada
    const idExistente = await verificarPaquetePorCurp(paquete.curp);

    if (idExistente) {
      // Si existe, retorna el ID del paquete existente
      return { idPaquete: idExistente };
    }

    // Si no existe, continúa con el registro del nuevo paquete
    const { data, error } = await supabase
      .from('Paquete')
      .insert([{
        nombre: paquete.nombre,
        precio_total: paquete.precio_total,
        curp: paquete.curp
      }])
      .select();  // Asegúrate de que la consulta devuelve datos

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message || 'Error al registrar el paquete');
    }

    if (!data || data.length === 0) {
      throw new Error('No se recibieron datos al registrar el paquete');
    }

    // Devuelve el ID del nuevo paquete registrado
    return { idPaquete: data[0].idPaquete };
  } catch (err) {
    console.error('Error capturado en registrarPaquete:', err);
    throw err;
  }
};

// Función para verificar si una clase ya está asociada a un paquete
const verificarClaseEnPaquete = async (paqueteId, idClase) => {
  try {
    const { data, error } = await supabase
      .from('PaqueteClases')
      .select('idClase')
      .eq('idPaquete', paqueteId)
      .eq('idClase', idClase);

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message || 'Error al verificar la clase en el paquete');
    }

    // Retorna true si hay al menos un registro que coincide, false en caso contrario
    return data.length > 0;
  } catch (err) {
    console.error('Error capturado en verificarClaseEnPaquete:', err);
    throw err;
  }
};

// Función para registrar clases en un paquete
export const registrarPaqueteClases = async (paqueteId, clasesSeleccionadas) => {
  try {
    // Filtrar las clases que no están asociadas al paquete
    const clasesParaRegistrar = [];
    for (const clase of clasesSeleccionadas) {
      const yaExiste = await verificarClaseEnPaquete(paqueteId, clase.idClase);
      console.log(yaExiste)
      if (!yaExiste) {
        clasesParaRegistrar.push({
          idPaquete: paqueteId,
          idClase: clase.idClase,
        });
      }
    }

    if (clasesParaRegistrar.length > 0) {
      const { error } = await supabase
        .from('PaqueteClases')
        .insert(clasesParaRegistrar);

      if (error) {
        throw error;
      }
    }

  } catch (err) {
    console.error("Error al registrar las clases del paquete:", err);
    throw err;
  }
};

// Función para listar todos los paquetes
export const listarTodosLosPaquetes = async () => {
  try { 
    const { data, error } = await supabase
      .from('Paquete')
      .select('*'); // Selecciona todos los campos de la tabla

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message || 'Error al listar los paquetes');
    }

    // Retorna los datos obtenidos
    return data;
  } catch (err) {
    console.error('Error capturado en listarTodosLosPaquetes:', err);
    throw err;
  }
};

export const eliminarClaseDelPaquete = async (idClase, curp) => {
  try {
    // Obtener el ID del paquete basado en el CURP
    const { data: paqueteData, error: paqueteError } = await supabase
      .from('Paquete')
      .select('idPaquete')
      .eq('curp', curp)
      .single(); // Asegúrate de obtener un solo registro

    if (paqueteError) {
      throw paqueteError;
    }
    console.log(paqueteData)
    const idPaquete = paqueteData.idPaquete;

    // Eliminar la clase del paquete
    const { data: deleteData, error: deleteError } = await supabase
      .from('PaqueteClases')
      .delete()
      .eq('idClase', idClase)
      .eq('idPaquete', idPaquete);

    if (deleteError) {
      throw deleteError;
    }

    return deleteData;
  } catch (error) {
    console.error('Error al eliminar la clase del paquete:', error.message);
    throw error;
  }
};

*/

import axios from 'axios';

const apiClient = axios.create({
  //baseURL: 'http://127.0.0.1:8000',
  baseURL: 'https://cadi.onrender.com/', // URL base de tu API Django
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para registrar un paquete
export const registrarPaquete = async (paquete, clasesSeleccionadas,listaPagos,datosInscripciones) => {
  try {
    
    console.log(datosInscripciones)
    const response = await apiClient.post('/clase/registrarPaquete/', {
      paquete: paquete,
      clasesSeleccionadas: clasesSeleccionadas,
      listaPagos: listaPagos,
      datosInscripciones: datosInscripciones // Enviar el objeto `paquete` en el cuerpo de la solicitud
    }); 
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error:', error.message);
    return { data: null, error: error.message };
  }
};

// Función para registrar clases en un paquete
export const registrarPaqueteClases = async (paqueteId, clasesSeleccionadas) => {
  try {
    // Asegúrate de enviar las clases en el formato correcto
    console.log(paqueteId)
    console.log(clasesSeleccionadas)
    const response = await apiClient.post('/clase/registrar-clases-paquete/', { paqueteId:paqueteId, clases: clasesSeleccionadas });
     
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error:', error.message);
    return { data: null, error: error.message };
  }
};

// Función para listar todos los paquetes
export const listarTodosLosPaquetes = async () => {
  try {
    const response = await apiClient.get('/clase/listarPaquetes/');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error:', error.message);
    return { data: [], error: error.message };
  }
};

// Función para eliminar una clase del paquete
export const eliminarClaseDelPaquete = async (idClase, curp) => {
  try {
    console.log(idClase,curp)
    const response = await apiClient.delete('/clase/eliminarClasePaquete/', {
      idClase: idClase, // El objeto que contiene la información del alumno
      curp: curp,    // Esto debe ser un array de inscripciones
  });
    return { data: response.data, error: null };
  } catch (error) {
    //console.error('Error:', error.message);
    return { data: null, error: error.message };
  }
};

/*
// Función para verificar si ya existe un paquete para una CURP
const verificarPaquetePorCurp = async (curp) => {
  try {
    const response = await apiClient.get(`/paquete/`, { params: { curp } });
    return response.data.idPaquete || null;
  } catch (error) {
    console.error('Error al verificar el paquete por CURP:', error.message);
    return null;
  }
};

// Función para verificar si una clase ya está en el paquete
const verificarClaseEnPaquete = async (paqueteId, idClase) => {
  try {
    const response = await apiClient.get('/paquete-clases/', { params: { idPaquete: paqueteId, idClase } });
    return response.data.length > 0;
  } catch (error) {
    console.error('Error al verificar la clase en el paquete:', error.message);
    return false;
  }
};
*/