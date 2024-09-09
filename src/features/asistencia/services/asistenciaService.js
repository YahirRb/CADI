import  supabase   from '../../../supabaseClient';

export const resgistroAsistencia = async (datosAlumno) => {
  try {
    const { data, error } = await supabase
      .from('Asistencia')
      .insert([datosAlumno]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};