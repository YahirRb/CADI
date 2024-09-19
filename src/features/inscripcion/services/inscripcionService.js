import supabase from '../../../supabaseClient'; // Ajusta la ruta según tu estructura

export const registrarInscripcion = async (datosInscripciones) => {
  try {
    console.log('Datos enviados:', datosInscripciones); // Verifica los datos que estás enviando

    // No necesitas envolver datosInscripciones en un array
    const { data, error } = await supabase
      .from('Inscripcion') // Asegúrate de que el nombre de la tabla sea correcto
      .insert(datosInscripciones); // Inserta un array de inscripciones directamente

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message);
    }

    console.log('Datos recibidos:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { data: null, error: error.message };
  }
};

export const obtenerInscripciones = async () => {
  try {
    const { data, error } = await supabase
      .from('Inscripcion') // Asegúrate de que el nombre de la tabla sea correcto
      .select('*');

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { data: [], error: error.message };
  }
};

// Nueva función para obtener una inscripción específica por id
export const obtenerInscripcionPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Inscripcion') // Asegúrate de que el nombre de la tabla sea correcto
      .select('*')
      .eq('idInscripcion', id) // Asegúrate de que el nombre del campo sea correcto
      .single(); // Espera un solo registro

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { data: null, error: error.message };
  }
};
export const obtenerInscripcionPorCurp = async (curp) => {
  try {
    const { data, error } = await supabase
      .from('Inscripcion') // Asegúrate de que el nombre de la tabla sea correcto
      .select('*')
      .eq('curp', curp)  // Espera un solo registro

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { data: null, error: error.message };
  }
};

export const actualizarAccesoInscripcion = async (curp, idClase, nuevoAcceso) => {
  try {
    // Actualiza el campo 'acceso' basado en 'curp' y 'idClase'
    const { data, error } = await supabase
      .from('Inscripcion')
      .update({ acceso: nuevoAcceso })
      .eq('curp', curp)
      .eq('idClase', idClase);

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message);
    }

    console.log('Datos actualizados:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { data: null, error: error.message };
  }
};

// Nueva función para eliminar una inscripción
export const eliminarInscripcion = async (curp, idClase) => {
  try {
    const { data, error } = await supabase
      .from('Inscripcion')
      .delete()
      .eq('curp', curp)
      .eq('idClase', idClase);

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message);
    }

    console.log('Datos eliminados:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { data: null, error: error.message };
  }
};