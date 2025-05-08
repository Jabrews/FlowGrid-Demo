import { motion } from 'framer-motion';

type DragTestProps = {
  children ?: React.ReactNode;
  dragConstraints: any;
};

export default function Dragable({ children, dragConstraints}: DragTestProps) {
  return (
    <motion.div
      className="drag-test"
      drag
      dragConstraints={dragConstraints}
      dragMomentum={false}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
        position: 'absolute',
        top: '50px',
        left: '50px',
        cursor: 'grab',
      }}
    >
      {children}

    </motion.div>
  );
}
