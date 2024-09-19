import  supabase   from '../../../supabaseClient';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};
export const registrarPago = async (datosPago) => {
  try {
    const datosPagoConFecha = {
      ...datosPago,
      pago_realizado: datosPago.pago_realizado || getTodayDate(),
    };

    const { data, error } = await supabase
      .from('Pagos')
      .insert([datosPagoConFecha]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


export const listarPagos = async () => {
  try {
    const { data, error } = await supabase
      .from('Pagos') // Nombre de tu tabla
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
/*
export const listarPagosPorCurp = async (curp) => {
    try {
      // Primero, obtén el id del alumno usando el CURP
      const { data: alumnoData, error: alumnoError } = await supabase
        .from('Alumnos') // Asegúrate de que este es el nombre correcto de tu tabla de alumnos
        .select('curp') // Supongamos que 'id' es el campo que almacena el identificador del alumno
        .eq('curp', curp) // Filtra por CURP
        .single(); // Obtén un solo resultado
  
      if (alumnoError) throw new Error(alumnoError.message);
  
      // Ahora, usa el id del alumno para filtrar los pagos
      const { data: pagosData, error: pagosError } = await supabase
        .from('Pagos') // Nombre de tu tabla de pagos
        .select('*')
        .eq('alumno_id', alumnoData.id); // Filtra por el id del alumno obtenido
  
      if (pagosError) throw new Error(pagosError.message);
  
      return pagosData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };*/
  export const listarPagosPorCurp = async (curp) => {
    try {
      // Obtener datos del alumno usando el CURP
      const { data: alumnoData, error: alumnoError } = await supabase
        .from('Alumnos')
        .select('nombre, apellidos, curp')
        .eq('curp', curp)
        .single();
        
      if (alumnoError) throw new Error(alumnoError.message);
      if (!alumnoData) throw new Error('Alumno no encontrado');
  
      // Usar el id del alumno para obtener sus pagos
      const { data: pagosData, error: pagosError } = await supabase
        .from('Pagos')
        .select('*')
        .eq('curp', alumnoData.curp)
        .order('proximo_pago', { ascending: false });
      if (pagosError) throw new Error(pagosError.message);
    // Verifica los datos aquí
  
      // Combinar datos del alumno y pagos
      return {
        alumno: alumnoData,
        pagos: pagosData || []
      };
      
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  export const editarPago = async (idPago, datosActualizados) => {
    try {
      const { data, error } = await supabase
        .from('Pagos')  // Nombre de la tabla de pagos
        .update(datosActualizados)  // Datos que se van a actualizar
        .eq('idPago', idPago);  // Condición para encontrar el pago por su id
  
      if (error) {
        throw new Error(error.message);
      }
  
      return data;
    } catch (error) {
      console.error('Error al editar el pago:', error);
      throw error;
    }
  };