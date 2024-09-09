import { useState } from 'react';
import { useClase } from '../hooks/useClases'; // Asume que tendrás un hook similar

const ClaseForm = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cupo, setCupo] = useState('');
    const [costo, setCosto] = useState('');
    const [dias, setDias] = useState('');
    const [horario, setHorario] = useState('');
    const { registroClase, loading, error } = useClase();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Convierte la cadena de días en un array
      const diasArray = dias.split(',').map(dia => dia.trim());
      registroClase({ nombre, descripcion, cupo, costo, dias: diasArray, horario });
    };
  
    return (
      <div>
        <h2>Registro de Clase</h2>
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
            <label>Descripción:</label>
            <input 
              type="text" 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Cupo:</label>
            <input 
              type="number" 
              value={cupo} 
              onChange={(e) => setCupo(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Costo:</label>
            <input 
              type="number" 
              step="0.01"
              value={costo} 
              onChange={(e) => setCosto(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Días:</label>
            <input 
              type="text" 
              value={dias} 
              onChange={(e) => setDias(e.target.value)} 
              required 
              placeholder="Ingresa días separados por comas"
            />
          </div>
          <div>
            <label>Horario:</label>
            <input 
              type="text" 
              value={horario} 
              onChange={(e) => setHorario(e.target.value)} 
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
  
  export default ClaseForm;
  