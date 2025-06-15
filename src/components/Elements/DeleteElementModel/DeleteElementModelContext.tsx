import { createContext, useContext, useState } from 'react';

type DeleteModalContextType = {
  show: boolean;
  targetId: string | null;
  open: (id: string, onConfirm: () => void) => void;
  confirm: () => void;
  cancel: () => void;
};

const DeleteModalContext = createContext<DeleteModalContextType | undefined>(undefined);

export function DeleteModalProvider({ children }: { children: React.ReactNode }) {



  const [show, setShow] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const open = (id: string, confirmFn: () => void) => {
    setTargetId(id);
    setOnConfirm(() => confirmFn);
    setShow(true);
  };

  const confirm = () => {
    if (onConfirm) onConfirm();
    setShow(false);
    setTargetId(null);
  };

  const cancel = () => {
    setShow(false);
    setTargetId(null);
  };

  return (
    <DeleteModalContext.Provider value={{ show, targetId, open, confirm, cancel }}>
      {children}
    </DeleteModalContext.Provider>
  );
}

export function useDeleteModal() {
  const context = useContext(DeleteModalContext);
  if (!context) throw new Error('useDeleteModal must be used within DeleteModalProvider');
  return context;
}
