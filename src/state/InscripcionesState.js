// useInscripciones.js
import create from 'zustand';
import { persist } from 'zustand/middleware';

// Define el store
const useInscripciones = create(persist(
  (set) => ({
    inscripciones: [],
    addInscripcion: (inscripcion) => set((state) => ({
      inscripciones: [...state.inscripciones, inscripcion]
    })),
    removeInscripcion: (idInscripcion) => set((state) => ({
      inscripciones: state.inscripciones.filter(ins => ins.idInscripcion !== idInscripcion)
    })),
    clearInscripciones: () => set({ inscripciones: [] }) // Nuevo método para borrar todas las inscripciones
  }),
  {
    name: 'inscripciones-storage', // Nombre de la clave en localStorage
    getStorage: () => localStorage // Usa localStorage para persistencia
  }
));

export default useInscripciones;
