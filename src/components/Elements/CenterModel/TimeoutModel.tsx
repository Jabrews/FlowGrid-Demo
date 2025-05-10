import { useEffect, useRef } from 'react';
import { useTimeoutModal } from "./CenterModelContext";

export default function TimeoutModel() {
  const { showModal, closeModal } = useTimeoutModal();

  const timeoutSound = useRef<HTMLAudioElement | null>(null); // ✅ correct typing

  useEffect(() => {
    if (showModal) {
      timeoutSound.current = new Audio('/sounds/TimerEnd.mp3');
      timeoutSound.current.play().catch(e => {
        console.log('Autoplay blocked:', e);
      });
    }
  }, [showModal]);

  const handleClose = () => {
    if (timeoutSound.current) {
      timeoutSound.current.pause();
      timeoutSound.current.currentTime = 0;
    }
    closeModal();
  };

  if (!showModal) return null;

  return (
    <div className="center-modal">
      <p> Timer Ended!</p>
      <button onClick={handleClose}>Close</button>
    </div>
  );
}
