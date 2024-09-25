import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import useRegistroAsistencia from '../hooks/useAsistencia'; // Ajusta la ruta según sea necesario
import './asistenciaForm.css'; // Asegúrate de tener un archivo CSS para el estilo

const AsistenciaForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { inscripciones, registrarAsistencia, loading, error } = useRegistroAsistencia();
  
  const [selectedInscripcion, setSelectedInscripcion] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isResultModalOpen, setResultModalOpen] = useState(false); // Modal para mostrar resultados
  const [registrationMessage, setRegistrationMessage] = useState(''); // Mensaje registrado

  // Maneja el clic en una fila de la tabla
  const handleRowClick = (inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setModalOpen(true);
  };

  // Función para registrar asistencia
  const handleRegisterAsistencia = async () => {
    if (selectedInscripcion) {
      const { curp } = selectedInscripcion;

      // Crea el objeto en el formato deseado
      const dataToSend = {
        curp: curp,
        ids_inscripciones: [selectedInscripcion.idInscripcion] // Agrega el ID de inscripción seleccionado
      };

      try {
        // Llama a la función registrarAsistencia y pasa los datos
        const data = await registrarAsistencia(dataToSend.curp, dataToSend.ids_inscripciones);
        setRegistrationMessage(data[0].mensaje); // Extrae el mensaje
        setModalOpen(false); // Cierra el modal de registro
        setResultModalOpen(true); // Abre el modal de resultados
      } catch (error) {
        console.error('Error al registrar asistencia:', error);
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  const filteredInscripciones = searchTerm.trim() === ''
    ? inscripciones
    : inscripciones.filter(inscripcion =>
        inscripcion.nombre_alumno?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="table-container-wrapper">
      <Typography variant="h4" align="center" gutterBottom>
        Registro de Asistencia
      </Typography>
      
      <div className="search-container">
        <TextField
          label="Buscar por Nombre del Alumno"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
      </div>
      
      <TableContainer component={Paper} className="table-container">
        <Table aria-label="lista de inscripciones" className="table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-head-cell">ID</TableCell>
              <TableCell className="table-head-cell">CURP</TableCell>
              <TableCell className="table-head-cell">Clase</TableCell>
              <TableCell className="table-head-cell">Nombre del Alumno</TableCell>
              <TableCell className="table-head-cell">Apellidos</TableCell>
              <TableCell className="table-head-cell">Horario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInscripciones.length > 0 ? (
              filteredInscripciones.map((inscripcion) => (
                <TableRow 
                  key={inscripcion.idInscripcion} 
                  className="table-row"
                  onClick={() => handleRowClick(inscripcion)}
                >
                  <TableCell className="table-cell">{inscripcion.idInscripcion || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.curp || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.nombre_clase || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.nombre_alumno || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.apellidos_alumno || '-'}</TableCell>
                  <TableCell className="table-cell">{inscripcion.horario || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No se encontraron inscripciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para registrar asistencia */}
      <Dialog open={isModalOpen} onClose={() => setModalOpen(false)} className="modal-dialog">
        <DialogTitle className="modal-title">Registrar Asistencia</DialogTitle>
        <DialogContent className="modal-content">
          {selectedInscripcion && (
            <>
              <p>ID de Inscripción: {selectedInscripcion.idInscripcion}</p>
              <p>CURP: {selectedInscripcion.curp}</p>
              <p>Nombre del Alumno: {selectedInscripcion.nombre_alumno}</p>
              <p>Clase: {selectedInscripcion.nombre_clase}</p>
            </>
          )}
        </DialogContent>
        <DialogActions className="modal-actions">
          <Button onClick={handleRegisterAsistencia} color="primary" variant="contained">
            Registrar Asistencia
          </Button>
          <Button onClick={() => setModalOpen(false)} color="secondary" variant="outlined">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar resultados */}
      <Dialog open={isResultModalOpen} onClose={() => setResultModalOpen(false)} className="modal-dialog">
        <DialogTitle className="modal-title">Resultado de Registro</DialogTitle>
        <DialogContent className="modal-content">
          {registrationMessage && (
            <p className="result-message">{registrationMessage}</p> // Aplica la clase al mensaje
          )}
        </DialogContent>
        <DialogActions className="modal-actions">
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}> {/* Contenedor flex */}
            <Button onClick={() => setResultModalOpen(false)} color="primary" variant="contained">
              Aceptar
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AsistenciaForm;
