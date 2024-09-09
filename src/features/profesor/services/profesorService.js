import supabase from '../../../supabaseClient'; // Ajusta la ruta según tu estructura

export const registrarProfesor = async (datosProfesor) => {
  try {
    const { data, error } = await supabase
      .from('Profesor') // Cambia 'Profesores' por el nombre de tu tabla en Supabase
      .insert([datosProfesor]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};