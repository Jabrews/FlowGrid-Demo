import { createContext, useContext } from "react";
import { create } from "zustand";



// store factory
const createConnectionToggleModalStore = () =>
  create((set, get) => ({
    showModal: false,
    toggleShowModal: (status: boolean) => {
      try {
        set(() => ({
          showModal: status
        }));
      } catch (error) {
        console.log('Error occurred toggling ConnectionToggleModal:', error);
      }
    },
  }));

// context
const ConnectionToggleModalContext = createContext(null);

// provider
export const ConnectionToggleModalContextProvider = ({ children }) => {
  const store = createConnectionToggleModalStore();
  return (
    <ConnectionToggleModalContext.Provider value={store}>
      {children}
    </ConnectionToggleModalContext.Provider>
  );
};

// hook
export const useConnectionToggleModalStore = () => {
  const store = useContext(ConnectionToggleModalContext);
  if (!store)
    throw new Error(
      "useConnectionToggleModalStore must be used inside ConnectionToggleModalContextProvider"
    );
  return store;
};