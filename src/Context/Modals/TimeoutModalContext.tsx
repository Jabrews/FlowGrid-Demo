import { createContext, useContext } from "react";
import { create } from "zustand";



// store factory
const createTimeoutModalContext = () =>
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
  }));

// context
const TimeoutModalContext = createContext(null);

// provider
export const TimeoutModalContextProvider = ({ children }) => {
  const store = createTimeoutModalContext();
  return (
    <TimeoutModalContext.Provider value={store}>
      {children}
    </TimeoutModalContext.Provider>
  );
};

// hook
export const useTimeoutModalContext = () => {
  const store = useContext(TimeoutModalContext);
  if (!store)
    throw new Error(
      "useTimeoutModalContext must be used inside a ConnectionToggleModalContextProvider"
    );
  return store;
};