import { NavigateFunction } from "react-router-dom";

const handleButtonSubmit = (nav: NavigateFunction) => () => {
  alert(
    `La dimensión de la ventana es: ${window.innerWidth}px x ${window.innerHeight}px`
  );
  nav("/");
};

export default handleButtonSubmit;
