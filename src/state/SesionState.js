import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAuth = create(persist((set) => ({
  accessToken: null,
  refreshToken: null,
  isAdmin: false, // Por defecto es falso
  isAlumno:false,
  username:null,
  setTokens: (access, refresh, admin,curp) => set({ accessToken: access, refreshToken: refresh, isAdmin: admin, username: curp,isAlumno: !admin }),
  logout: () => set({ accessToken: null, refreshToken: null, isAdmin: false, isAlumno: false, username: null }),
}), {
  name: 'auth-storage', // Nombre de la clave en localStorage
  getStorage: () => localStorage, // Usa localStorage para persistencia
}));

export default useAuth;
