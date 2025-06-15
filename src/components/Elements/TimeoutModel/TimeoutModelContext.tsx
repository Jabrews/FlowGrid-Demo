import { createContext, useContext, useState} from "react";

// define the shape of the context (what it provides to components)
type ModalContextType = {
  showModal: boolean; // true if modal should be visible
  openModal: () => void; // function to open the modal
  closeModal: () => void;  // function to close the modal
};

// create the context with an undefined default
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// context provider component that wraps your app
export function ModalProvider({ children }: { children: any }) {
  const [showModal, setShowModal] = useState(false); // state to track if modal is open

  // function to show the modal
  const openModal = () => setShowModal(true);

  // function to hide the modal
  const closeModal = () => setShowModal(false);

  // provide the modal state and control functions to all children
  return (
    <ModalContext.Provider value={{ showModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

// custom hook to access the modal context from any component
export function useTimeoutModal() {
  const context = useContext(ModalContext);

  // throw an error if used outside the provider
  if (!context) throw new Error("useModal must be used inside ModalProvider");

  return context;

}

