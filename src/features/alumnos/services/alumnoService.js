import { supabase } from '../../../supabaseClient';

export const registerStudent = async (studentData) => {
  try {
    const { data, error } = await supabase
      .from('Alumnos')
      .insert([studentData]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};