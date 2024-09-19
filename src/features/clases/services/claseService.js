import supabase from '../../../supabaseClient'; // Ajusta la ruta según tu estructura

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