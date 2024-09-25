import { useState } from 'react';
import { Button, TextField, Typography, Paper } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import useAuth from '../state/SesionState'; 
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Obtén el método setTokens desde el store
  const { setTokens } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError(''); // Limpiar el error

    try {
      // Hacer la solicitud a la API
      const response = await axios.post( 'https://cadi.onrender.com/login/',{ //'http://127.0.0.1:8000/login/', {
        username: email,
        password: password,
      });

      // Manejar la respuesta
      console.log('Respuesta de la API:', response.data);

      // Decodificar el token de acceso para obtener isAdmin
      const decodedToken = jwtDecode(response.data.access);
      console.log(decodedToken.user_id)
      const isAdmin = decodedToken.isAdmin; // Asegúrate de que este campo esté en el token
      const curp = decodedToken.user_id;

      // Guardar los tokens y el estado de isAdmin usando Zustand
      setTokens(response.data.access, response.data.refresh, isAdmin,curp);
      navigate('/');
      // Aquí puedes redirigir al usuario o hacer otras acciones
    } catch (error) {
      // Manejar el error
      console.error('Error en la solicitud:', error);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <Paper elevation={3} className="login-form">
        <Typography variant="h4" component="h1" className="login-title">
          Iniciar Sesión
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit} className="form-content">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="login-button"
            fullWidth
          >
            Entrar
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Login;