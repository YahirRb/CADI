import { useState } from 'react';
import { usePersonal } from '../hooks/usePersonal'; // Asume que tendrás un hook similar

const PersonalForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const { registroPersonal, loading, error } = usePersonal();

  const handleSubmit = (e) => {
    e.preventDefault();
    registroPersonal({ nombre, apellidos,correo });
  };

  return (
    <div>
      <h2>Registro de Personal</h2>
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
        <div>
          <label>Correo:</label>
          <input 
            type="email" 
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
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

export default PersonalForm;