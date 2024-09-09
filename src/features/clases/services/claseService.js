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