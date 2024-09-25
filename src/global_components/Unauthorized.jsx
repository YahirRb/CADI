// components/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css'; // Asegúrate de tener estilos para el componente

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>Acceso No Autorizado</h1>
      <p>Lo siento, no tienes permiso para acceder a esta página.</p>
      <Link to="./home">Volver a la página principal</Link>
    </div>
  );
};

export default Unauthorized;