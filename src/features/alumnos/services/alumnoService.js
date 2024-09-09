import  supabase   from '../../../supabaseClient';

export const resgistroAlumno = async (datosAlumno) => {
  try {
    const { data, error } = await supabase
      .from('Alumnos')
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