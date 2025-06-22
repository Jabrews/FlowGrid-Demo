import {motion} from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useTimeoutModal } from "./TimeoutModelContext";

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
    <motion.div className="center-modal" drag dragMomentum={false}
>
      <p> Timer Ended!</p>
      <button onClick={handleClose} onTouchStart={handleClose}>Close</button>
    </motion.div>
  );
}
