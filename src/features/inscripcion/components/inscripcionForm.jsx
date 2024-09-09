import { useState } from 'react';
import { useInscripcion } from '../hooks/useInscripcion'; // Asume que tendrás un hook similar

const InscripcionForm = () => {
  const [curp, setCurp] = useState('');
  const [idClase, setIdClase] = useState('');
  const [fechaInscripcion, setFechaInscripcion] = useState('');
  const [acceso, setAcceso] = useState('');
  const { registroInscripcion, loading, error } = useInscripcion();

  const handleSubmit = (e) => {
    e.preventDefault();
    registroInscripcion({ curp, idClase, fechaInscripcion, acceso });
  };

  return (
    <div>
      <h2>Registro de Inscripción</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>CURP:</label>
          <input 
            type="text" 
            value={curp} 
            onChange={(e) => setCurp(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>ID de Clase:</label>
          <input 
            type="text" 
            value={idClase} 
            onChange={(e) => setIdClase(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Fecha de Inscripción:</label>
          <input 
            type="date" 
            value={fechaInscripcion} 
            onChange={(e) => setFechaInscripcion(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Acceso:</label>
          <input 
            type="text" 
            value={acceso} 
            onChange={(e) => setAcceso(e.target.value)} 
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

export default InscripcionForm;