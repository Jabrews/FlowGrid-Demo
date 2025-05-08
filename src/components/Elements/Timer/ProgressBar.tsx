import { motion } from 'framer-motion';

export type ProgressBarProps = {
  progress: number; // Progress value between 0 and 100
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className='timer-progress-bar-container' >
      <motion.div
        className='timer-progress-bar'
    
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
            type: 'easeInOut',
            duration: 0.3,
          }}
        />
    </div>
  );
}