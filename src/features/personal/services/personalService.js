import supabase from '../../../supabaseClient';

export const registrarPersonal = async (datosPersonal) => {
  try {
    console.log('Datos enviados:', datosPersonal);
    const { data, error } = await supabase
      .from('Personal')
      .insert([datosPersonal]);

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