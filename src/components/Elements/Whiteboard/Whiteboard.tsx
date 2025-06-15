import { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import WhiteboardGrid from './WhiteboardGrid';
import type {DroppedItem} from '../../Context/ItemFactory/ItemFactoryContext';

// Item Factory
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';

// leader Line

export default function Whiteboard() {


  const [gridMargin, setGridMargin] = useState<[number, number]>([100, 150]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setGridMargin([50, 135]);
      } else {
        setGridMargin([70, 155]);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { setNodeRef } = useDroppable({ id: 'droppable-1' });

  return (
    <div className="whiteboard" style={{ width: '100%', height: '100vh', overflow: 'scroll', background: 'black' }}>
      <div
        ref={setNodeRef}
        style={{
          margin: '0.5em',
          display: 'inline-block',
          width: '2000px',
          height: '2000px',
          background: 'grey',
        }}
        className="droppable-div"
      >
        <WhiteboardGrid
          gridMargin={gridMargin}
        />


      </div>
    </div>
  );
}
