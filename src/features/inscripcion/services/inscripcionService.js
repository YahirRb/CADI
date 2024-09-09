import supabase from '../../../supabaseClient'; // Ajusta la ruta según tu estructura

export const registrarInscripcion = async (datosInscripcion) => {
  try {
    console.log('Datos enviados:', datosInscripcion); // Verifica los datos que estás enviando
    const { data, error } = await supabase
      .from('Inscripcion') // Asegúrate de que el nombre de la tabla sea correcto
      .insert([datosInscripcion]);

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message);
    }

    console.log('Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};