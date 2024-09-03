import { create } from "zustand";

type useDoctorMenuSheet = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useDoctorMenuSheet = create<useDoctorMenuSheet>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
