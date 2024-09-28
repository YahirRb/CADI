import { create } from "zustand";

interface NavigationStateProps {
  indexNav: number | null;
  setIndexNav: (newIndex: number) => void;
}
const useNavigationState = create<NavigationStateProps>((set) => ({
  indexNav: null,
  setIndexNav: (newIndexNav) => set({ indexNav: newIndexNav }),
}));

export default useNavigationState;
