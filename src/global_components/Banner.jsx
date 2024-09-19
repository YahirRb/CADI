import { useNavigate } from "react-router-dom";
import "./menuBanner.css";

export default function Banner() {
  const nav = useNavigate();

  return (
    <header className="banner">
      <span
        className="identificador"
        onClick={() => {
          nav("/inscripcion");
        }}
      >
        <img className="logo" src="../../public/foto.png" alt="Logo" />
        <h1 className="titulo_principal">CADI</h1>
      </span>
    </header>
  );
}