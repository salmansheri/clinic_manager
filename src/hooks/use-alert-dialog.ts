import { create } from "zustand";

type UseAlertDialogProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAlertDialog = create<UseAlertDialogProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
