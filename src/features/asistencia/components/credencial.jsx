import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code'; 
import { useInscripcion } from '../../inscripcion/hooks/useInscripcion';
import { useStudent } from '../../alumnos/hooks/useAlumno'; // Importa el hook
import './credencial.css';

const QRCodeTemplate = () => {
  const { inscripcion, listarInscripcionPorCurp, loading: inscripcionLoading, error: inscripcionError } = useInscripcion();
  const { buscarAlumno, loading: studentLoading, error: studentError } = useStudent();
  
  const [ids, setIds] = useState([]);
  const [alumno, setAlumno] = useState(null);
  const curp = '2d'; // Cambia esto por la CURP real
  
  useEffect(() => {
    if (curp) {
      listarInscripcionPorCurp(curp);
      buscarAlumno(curp).then(data => setAlumno(data));
      console.log(alumno)
    }
  }, [ ]);

  useEffect(() => {
    if (inscripcion && inscripcion.length > 0) {
      const idsArray = inscripcion.map(ins => ins.idInscripcion);
      setIds(idsArray);
    }
  }, [inscripcion]);

  if (inscripcionLoading || studentLoading) return <p>Cargando...</p>;
  if (inscripcionError || studentError) return <p>Error: {inscripcionError || studentError}</p>;

  const idsString = JSON.stringify(ids);
  const nombreCompleto = alumno ? `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}` : 'Nombre no disponible';

  return (
    <div id="cred_container">
      <span className="cred_data" id="cred_logo">
        <p>CADI Minatitlán</p>
      </span>
      <span className="cred_data" id="cred_imagen">
        <img src="https://tiermaker.com/images/templates/1314061561452609.png" alt="Foto persona" />
      </span>
      <span className="cred_data" id="cred_nombre">
        {nombreCompleto}
      </span>
      <span className="cred_data" id="cred_qr">
        {ids.length > 0 ? (
          <QRCode value={idsString} size={128} /> 
        ) : (
          <p>No se encontraron inscripciones para la CURP proporcionada.</p>
        )}
      </span>
      <span className="cred_decoracion" id="cred_rect_sup"></span>
      <span className="cred_decoracion" id="cred_rect_rojo"></span>
      <span className="cred_decoracion" id="cred_linea_roja"></span>
      <span className="cred_decoracion" id="cred_triangulo_fondo"></span>
    </div>
  );
};

export default QRCodeTemplate;
