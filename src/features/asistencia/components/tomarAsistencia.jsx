import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import './QRCodeScanner.css'; // Asegúrate de importar tu archivo CSS
import useRegistroAsistencia from '../hooks/asistenciaUse';
import { useNavigate } from 'react-router-dom';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [responseData, setResponseData] = useState([]); // Cambiado a array para múltiples respuestas
  const [imageUrl, setImageUrl] = useState(null); // Estado para la URL de la imagen
  const { registrarAsistencia, loading, error } = useRegistroAsistencia();

  const handleScan = async (data) => {
    if (data && data.text) {
      try {
        const jsonData = JSON.parse(data.text);

        if (!Array.isArray(jsonData.inscripciones)) {
          jsonData.inscripciones = [];
        }

        setQrData(jsonData);
        console.log(jsonData.inscripciones);

        // Registra la asistencia usando el hook
        const datos = await registrarAsistencia(jsonData.curp, jsonData.inscripciones);
        console.log(datos);

        // Guarda la URL de la imagen en el estado
        if (datos.source) {
          setImageUrl(datos.source); // Suponiendo que 'datos.source' contiene la URL de la imagen
        }

        // Guarda el array de respuestas en el estado
        setResponseData(datos.mensajes);

      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
      setScanning(false);

      setTimeout(() => {
        setScanning(true);
      }, 5000);
    }
  };

  const handleError = (err) => {
    console.error('QR code error:', err);
  };

  const handleButtonClick = () => {
    setScanning(true);
  setResponseData([]);
  setImageUrl(null);
  
  // Navega a otra página
  navigate('/asistencia');
  };

  return (
    <div className="scanner-wrapper">
      {/* Botón en la parte superior */}
      
      
      <div className="card-container">
        <h3>Datos del QR:</h3>
        <button onClick={handleButtonClick} className="top-button">
        Registrar sin credencial
      </button>
        {loading && <p>Registrando asistencia...</p>}
        {error && <p>Error: {error.message}</p>}
        {responseData.length > 0 && (
          <div className="response-cards">
            {/* Mostrar la imagen si existe */}
            {imageUrl && (
              <div className="image-container">
                <h4>Imagen del Alumno:</h4>
                <img src={imageUrl} alt="Alumno" className="alumno-image" style={{ width: '150px', height: 'auto' }} />
              </div>
            )}
            {responseData.map((response, index) => (
              <div key={index} className="response-card">
                <p><strong>ID Inscripción:</strong> {response.idInscripcion}</p>
                <p>{response.mensaje}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="scanner-section">
        {scanning && (
          <div className="scanner-container">
            <QrScanner
              onScan={handleScan}
              onError={handleError}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="qr-highlight"></div> {/* Cuadro de detección */}
          </div>
        )}
        {!scanning && <p>Escaneo exitoso. Reiniciando en 5 segundos...</p>}
      </div>
    </div>
  );
};

export default QRCodeScanner;
