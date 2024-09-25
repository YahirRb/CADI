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
      const response = await axios.post('https://cadi.onrender.com/login/', {
        username: email,
        password: password,
      });

      const decodedToken = jwtDecode(response.data.access);
      const isAdmin = decodedToken.isAdmin;
      const curp = decodedToken.user_id;

      setTokens(response.data.access, response.data.refresh, isAdmin, curp);
      navigate('/');
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <Paper elevation={5} className="login-form">
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
