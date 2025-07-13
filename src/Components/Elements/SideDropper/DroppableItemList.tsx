// DroppableItemList.tsx

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import DraggableItem from './DraggableItem';
import { GoChevronUp } from 'react-icons/go';
import type { ListItems } from './ItemList.ts';

type Props = {
  title: string;
  items: ListItems[];
  closeAllSignal: number;
};

export default function DroppableItemList({ title, items, closeAllSignal}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(false);
  }, [closeAllSignal]);
  

  return (
    <div className='drop-item-list-container'>
      <div className='drop-item-list-header'>
        <p>{title}</p>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <GoChevronUp />
        </motion.button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
        className='drop-item-list'
      >
        {items.map((item) => (
          <DraggableItem key={item.id} id={item.id} type={item.type}/>
        ))}
      </motion.div>
    </div>
  );
}
