import supabase from '../../../supabaseClient';

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