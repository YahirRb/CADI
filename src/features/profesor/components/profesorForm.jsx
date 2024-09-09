import { useState } from 'react';
import { useProfesor } from '../hooks/useProfesor'; // Asume que tendrás un hook similar

const ProfesorForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const { registroProfesor, loading, error } = useProfesor();

  const handleSubmit = (e) => {
    e.preventDefault();
    registroProfesor({ nombre, apellidos });
  };

  return (
    <div>
      <h2>Registro de Profesor</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Apellidos:</label>
          <input 
            type="text" 
            value={apellidos} 
            onChange={(e) => setApellidos(e.target.value)} 
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

export default ProfesorForm;