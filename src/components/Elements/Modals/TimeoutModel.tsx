import {motion} from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useTimeoutModalContext } from '../../../Context/Modals/TimeoutModalContext';



export default function TimeoutModel() {

  const timeoutSound = useRef<HTMLAudioElement | null>(null); // ✅ correct typing
  // Timeout Store
  const timeoutModalStore = useTimeoutModalContext()
  const toggleShowModal = timeoutModalStore((state) => state.toggleShowModal)


  useEffect(() => {
      timeoutSound.current = new Audio('../../../../public/sounds/TimerEnd.mp3');
      timeoutSound.current.play().catch(e => {
        console.log('Autoplay blocked:', e);
      })
    }, []);

  const handleClose = () => {
    if (timeoutSound.current) {
      timeoutSound.current.pause();
      timeoutSound.current.currentTime = 0;
    }
    toggleShowModal(false)
  };


  return (
    <motion.div className="center-modal" drag dragMomentum={false}>
      <p> Timer Ended!</p>
      <button onClick={handleClose} onTouchStart={handleClose}>Close</button>
    </motion.div>
  );
}
