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


export const listarAlumnos = async () => {
  try {
    const { data, error } = await supabase
      .from('Alumnos') // Nombre de tu tabla
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
  
};

export const buscarAlumnoPorCurp = async (curp) => {
  try {
    const { data, error, count } = await supabase
      .from('Alumnos')
      .select('*', { count: 'exact' }) // Asegúrate de recibir el conteo de resultados
      .eq('curp', curp);

    if (error) throw error;

    // Verifica si hay resultados
    if (data.length > 1) {
      throw new Error('Se encontraron múltiples alumnos con el mismo CURP.');
    }

    // Devuelve el primer resultado o null si no hay resultados
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    throw new Error(error.message);
  }
};