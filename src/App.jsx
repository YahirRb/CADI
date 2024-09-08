import { useState } from 'react'; 
import StudentForm from './features/alumnos/components/alumnoForm'; // Ajusta la ruta si es necesario

const App = () => {
  return (
    <div>
      <h1>Student Management System</h1>
      <StudentForm />
    </div>
  );
};

export default App;