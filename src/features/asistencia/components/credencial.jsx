import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code'; 
import { useInscripcion } from '../../inscripcion/hooks/useInscripcion';
import { useRegistroAsistencia } from '../../asistencia/hooks/useAsistencia'; 
import { useStudent } from '../../alumnos/hooks/useAlumno'; 
import { toPng } from 'html-to-image'; 
import { Button, Modal, Typography, CircularProgress, Input } from '@mui/material'; 
import DownloadIcon from '@mui/icons-material/Download'; 
import useAuth from '../../../state/SesionState'; 
import './credencial.css';

const QRCodeTemplate = () => {
  const { username } = useAuth();
  const { inscripcion, listarInscripcionPorCurp, loading: inscripcionLoading, error: inscripcionError } = useInscripcion();
  const { buscarAlumno, loading: studentLoading, error: studentError } = useStudent();
  const { obtenerFoto, registrarFoto, fotoUrl, loading: fotoLoading, error: fotoError } = useRegistroAsistencia(); 

  const [qrData, setQrData] = useState(null);
  const [alumno, setAlumno] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false); // Nuevo estado para manejar la subida de la foto
  
  const curp = username; 

  useEffect(() => {
    if (curp) {
      listarInscripcionPorCurp(curp);
      buscarAlumno(curp).then(data => {
        setAlumno(data);
      }); 
    }
  }, [curp]);

  useEffect(() => {
    if (inscripcion && inscripcion.length > 0 && alumno) {
      const idsInscripcion = inscripcion.map(ins => ins.idInscripcion);
      const qrObject = {
        curp: curp,
        inscripciones: idsInscripcion
      };
      setQrData(JSON.stringify(qrObject));
    }
  }, [inscripcion, alumno]); 

  useEffect(() => {
    if (alumno && !alumno.foto) {
      setModalOpen(true);
    }
  }, [alumno]);

  useEffect(() => {
    if (curp) {
      obtenerFoto(curp);
    }
  }, [curp]);

  // useEffect para obtener datos del alumno después de subir la foto
  useEffect(() => {
    if (isPhotoUploaded && alumno && alumno.foto !== null) {
      buscarAlumno(curp).then(data => {
        setAlumno(data);
        setIsPhotoUploaded(false); // Resetea el estado
      });
    }
  }, [isPhotoUploaded, curp, alumno]);
  
  if (inscripcionLoading || studentLoading || fotoLoading) 
    return <CircularProgress />;

  if (inscripcionError || studentError) {
    const errorMessage = inscripcionError?.message || studentError?.message || "Ocurrió un error inesperado.";
    return <p>Error: {errorMessage}</p>;
  }

  const nombreCompleto = alumno ? `${alumno.nombre} ${alumno.apellidos}` : 'Nombre no disponible';

  const downloadCredencial = () => {
    const credContainer = document.getElementById('cred_container');
    toPng(credContainer)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'credencial.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error al generar la imagen:', error);
      });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFile(null); // Limpiar la selección del archivo
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); 
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await registrarFoto(curp, selectedFile);
        console.log("Foto guardada con éxito");
        setIsPhotoUploaded(true); // Marca la foto como subida
        handleCloseModal();
        window.location.reload();
      } catch (error) {
        console.error("Error al subir la foto:", error);
      }
    }
  };

  return (
    <div>
      <div id="cred_container">
        <span className="cred_data" id="cred_logo">
          <p>CADI Minatitlán</p>
        </span>
        <span className="cred_data" id="cred_imagen">
          {fotoUrl ? (
            <img src={fotoUrl} alt="Foto del alumno" />
          ) : (
            <img src="" alt="Foto no disponible" />
          )}
        </span>
        <span className="cred_data" id="cred_nombre">
          {nombreCompleto}
        </span>
        <span className="cred_data" id="cred_qr">
          {qrData ? (
            <QRCode value={qrData} size={128} /> 
          ) : (
            <p>No se encontraron inscripciones para la CURP proporcionada.</p>
          )}
        </span>
        <span className="cred_decoracion" id="cred_rect_sup"></span>
        <span className="cred_decoracion" id="cred_rect_rojo"></span>
        <span className="cred_decoracion" id="cred_linea_roja"></span>
        <span className="cred_decoracion" id="cred_triangulo_fondo"></span>
      </div>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={downloadCredencial} 
        startIcon={<DownloadIcon />} 
        style={{ marginTop: '20px' }} 
      >
        Descargar Credencial
      </Button>

      {/* Modal para subir una foto */}
      <Modal
        open={modalOpen}
        onClose={() => {}} // Previene el cierre al hacer clic fuera
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-container">
          <Typography id="modal-title" className="modal-title" component="h2">
            Subir Foto
          </Typography>
          <Typography id="modal-description" className="modal-description">
            Necesitas una fotografía para tu credencial.
          </Typography>
          
          <div className="input-file-container">
            <Button
              variant="contained"
              color="primary"
              component="label"
              className="upload-button"
            >
              Subir Archivo
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                hidden
              />
            </Button>
          </div>

          {selectedFile && (
            <div>
              <img src={URL.createObjectURL(selectedFile)} alt="Previsualización" className="preview-image" />
            </div>
          )}

          <div className="modal-actions">
            <Button 
              onClick={handleUpload} 
              color="primary" 
              className="modal-button"
            >
              Subir Foto
            </Button>
            <Button 
              onClick={handleCloseModal} 
              color="secondary" 
              className="modal-button"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QRCodeTemplate;
