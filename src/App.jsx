import { useState } from 'react'; 
import { RouterProvider } from 'react-router-dom';
import router from './router'; // Ajusta la ruta si es necesario

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;