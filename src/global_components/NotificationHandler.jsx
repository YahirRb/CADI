// components/NotificationHandler.jsx
import { useEffect } from "react";
import useAuth from '../state/SesionState'; 

const NotificationHandler = () => {
  const { username } = useAuth(); // Obtén el username o curp desde el estado de Zustand
  
  useEffect(() => {
    if (!username) return; // Si no hay username (curp),no continuar
    const curp = username;  // Reemplaza esto con el CURP del alumno
    const socket = new WebSocket(`wss://cadi.onrender.com/ws/notificaciones/${curp}/`);

    socket.onopen = () => {
      console.log('Conectado al WebSocket');
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Notification.permission === 'granted') {
        new Notification("Notificación", { body: data.message,
          icon: '/public/foto.png',
         });
      }
    };

    socket.onclose = () => {
      console.log('WebSocket cerrado');
    };

    return () => {
      socket.close();
    };
  }, []);

  return null;
};

export default NotificationHandler;
