import { useTimeoutModal } from "./CenterModelContext";


export default function TimeoutModel() {
  const { showModal, closeModal } = useTimeoutModal();

  if (!showModal) return null;

  return (
    <div className="center-modal">
      <p>This is a test modal!</p>
      <button onClick={closeModal}>Close</button>
    </div>
  );
}
