import { useState} from 'react';
import { registrarPago, listarPagos, listarPagosPorCurp, editarPago } from '../services/pagosService'

const usePagos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [alumno, setAlumno] = useState(null)

  const registroPago = async (datosPago) => {
    setLoading(true);
    setError(null);
    try {
      await registrarPago(datosPago);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const listaPagos =async () => {
    try {
      const data = await listarPagos();
      setPagos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
/*
  const listaPagosPorCurp = async (curp) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarPagosPorCurp(curp);
      setPagos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
*/ const listaPagosPorCurp = async (curp) => {
  setLoading(true);
  setError(null);
  try {
    const { alumno, pagos } = await listarPagosPorCurp(curp);
    setAlumno(alumno);  // Guardar los datos del alumno
    setPagos(pagos);    // Guardar los pagos
  // Verifica los datos aquí

  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
const actualizarPago = async (idPago, datosActualizados) => {
  setLoading(true);
  setError(null);
  try {
    await editarPago(idPago, datosActualizados);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  return {
    loading,
    error,
    pagos,
    alumno,
    registroPago,
    listaPagos,
    listaPagosPorCurp,
    actualizarPago
  };
};

export default usePagos;