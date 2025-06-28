import { createContext, useContext } from "react";
import { create } from "zustand";



// store factory
const createDeleteElementModalContext= () =>
  create((set, get) => ({
    showModal: false,
    toggleShowModal: (status: boolean) => {
      try {
        set(() => ({
          showModal: status
        }));
      } catch (error) {
        console.log('Error occurred toggling TimeoutModal :', error);
      }
    },
    targetId: '',
    setTargetId: (newTargetId: string) => {
      set(() => ({ targetId: newTargetId }));
    }
  }));

// context
const DeleteElementModalContext = createContext(null);

// provider
export const DeleteElementModalContextProvider = ({ children }) => {
  const store = createDeleteElementModalContext();
  return (
    <DeleteElementModalContext.Provider value={store}>
      {children}
    </DeleteElementModalContext.Provider>
  );
};

// hook
export const useDeleteElementModalContext = () => {
  const store = useContext(DeleteElementModalContext);
  if (!store)
    throw new Error(
      "UseDeleteElementModalContext must be used inside a DeleteElementModalContext Provider "
    );
  return store;
};