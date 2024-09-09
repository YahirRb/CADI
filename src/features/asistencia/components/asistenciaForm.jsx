import { useState } from 'react';
import { useAsistencia } from '../hooks/useAsistencia'; // Asume que tienes un hook similar a useStudent

const AsistenciaForm = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const { registroAsistencia, loading, error } = useAsistencia();

  const handleSubmit = (e) => {
    e.preventDefault();
    registroAsistencia({ fecha, hora });
  };

  return (
    <div>
      <h2>Registro de Asistencia</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha:</label>
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Hora:</label>
          <input 
            type="time" 
            value={hora} 
            onChange={(e) => setHora(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        {error && <p>Error: {error}</p>}
      </form>
    </div>
  );
};

export default AsistenciaForm;