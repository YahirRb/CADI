import  { useState } from 'react';
import { useStudent } from '../hooks/useAlumno';

const AlumnoForm = () => {
  const [curp, setCurp] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tutor, setTutor] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const { registro, loading, error } = useStudent();

  const handleSubmit = (e) => {
    e.preventDefault();
    registro({ curp, nombre, apellidos, tutor, correo, telefono, fechaNacimiento });
  };

  return (
    <div>
      <h2>Registro de alumno</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>CURP:</label>
          <input type="text" value={curp} onChange={(e) => setCurp(e.target.value)} required />
        </div>
        <div>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Apellidos:</label>
          <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
        </div>
        <div>
          <label>Nombre del Tutor:</label>
          <input type="text" value={tutor} onChange={(e) => setTutor(e.target.value)} required />
        </div>
        <div>
          <label>Correo:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        {error && <p>Error: {error}</p>}
      </form>
    </div>
  );
};

export default AlumnoForm;