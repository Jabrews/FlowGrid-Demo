import { useState } from 'react';
import DroppableItemList from './DroppableItemList';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { ElementList } from './ItemList.ts';
import { PanelLeftOpen } from 'lucide-react';
import { PanelLeftClose } from 'lucide-react';
import {useIsMobile} from './useIsMobile.ts'


export default function SideDropper() {
  const [sideOpen, setSideOpen] = useState(true);
  const { setNodeRef } = useDroppable({ id: 'droppable-2' });
  const [isShaking, setIsShaking] = useState(false);
  const [closeAllSignal, setCloseAllSignal] = useState(0);

  const isMobile = useIsMobile();

  const handleMouseEnter = () => setIsShaking(true);
  const handleAnimationComplete = () => setIsShaking(false);

  return (
    <motion.div 
      className={`side-dropper-container ${sideOpen ? 'active' : ''}`} 
      ref={setNodeRef}
      initial={false}
      animate={{ 
        width: sideOpen 
          ? isMobile 
            ? '100%' // use viewport width on mobile
            : '20rem'
          : '1.6rem'
      }}
    >
      <div className="side-dropper-header">
        <motion.h2
          className="side-dropper-title"
          initial={false}
          animate={{ fontSize: sideOpen ? (isMobile ? '1.2rem' : '1.5rem') : '0.2rem' }}
          transition={{ type: 'spring', stiffness: 100, damping: 25 }}
        >
          {sideOpen ? 'Side Dropper' : ''}
        </motion.h2>

        <h2 className="close-icon" onClick={() => setSideOpen(!sideOpen)}>
          {sideOpen ? <PanelLeftClose size={30} className='side-dropper-symbol'/> : <PanelLeftOpen size={30} className='side-dropper-symbol'/>}
        </h2>
      </div>

      <div className="side-dropper-content">
        <div className='side-dropper-buttons-container'>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className='close-list-btn' 
            onClick={() => setCloseAllSignal(prev => prev + 1)}
          > 
            Close All Tabs
          </motion.button>

          <motion.button 
            onMouseEnter={handleMouseEnter}
            animate={isShaking ? { x: [0, -5, 5, -5, 5, 0] } : {}}
            onAnimationComplete={handleAnimationComplete}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className='workshop-btn'
          >
            Open Workshop 
          </motion.button>
        </div>

        {ElementList.map((group) => (
          <DroppableItemList
            key={group.title}
            title={group.title}
            items={group.items}
            closeAllSignal={closeAllSignal}
          />
        ))}
      </div>
    </motion.div>
  );
}
