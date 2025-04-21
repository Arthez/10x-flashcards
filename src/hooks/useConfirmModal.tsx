import { createContext, useContext, useState } from "react";
import { ConfirmModal } from "../components/ui/ConfirmModal";

interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

interface ConfirmModalContextValue {
  openModal: (options: ConfirmModalOptions) => void;
}

const ConfirmModalContext = createContext<ConfirmModalContextValue | undefined>(undefined);

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error("useConfirmModal must be used within a ConfirmModalProvider");
  }
  return context;
};

export const ConfirmModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalProps, setModalProps] = useState<(ConfirmModalOptions & { isOpen: boolean }) | null>(null);

  const openModal = (options: ConfirmModalOptions) => {
    setModalProps({ ...options, isOpen: true });
  };

  const closeModal = () => {
    setModalProps(null);
  };

  return (
    <ConfirmModalContext.Provider value={{ openModal }}>
      {children}
      {modalProps && (
        <ConfirmModal
          {...modalProps}
          onCancel={closeModal}
          onConfirm={() => {
            modalProps.onConfirm();
            closeModal();
          }}
        />
      )}
    </ConfirmModalContext.Provider>
  );
};
