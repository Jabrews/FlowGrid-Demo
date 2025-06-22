import { useEffect, useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';

// components
import WhiteboardGrid from './WhiteboardGrid';
import type { DroppedItem } from '../../Context/ItemFactory/ItemFactoryContext';
import ConnectionLineRenderer from '../ConnectionLineRenderer/ConnectionLineRenderer';

// Item Factory
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';

// line factory context (for scrolling)
import { useConnectionLinesContext } from '../../Context/ConnectionLines';

export default function Whiteboard() {
  const [gridMargin, setGridMargin] = useState<[number, number]>([100, 150]);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lineStore = useConnectionLinesContext();
  const clearLineRects = lineStore((state) => state.clearLineRects);
  const restoreLineRects = lineStore((state) => state.restoreLineRects);

const handleScroll = () => {
  clearLineRects(); // hide lines while scrolling

  if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

  scrollTimeoutRef.current = setTimeout(() => {
    restoreLineRects(); // redraw lines after scroll ends
  }, 100);
};

  useEffect(() => {
    const handleResize = () => {
      setGridMargin(window.innerWidth < 768 ? [50, 135] : [70, 155]);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { setNodeRef } = useDroppable({ id: 'droppable-1' });

  return (
    <div
      className="whiteboard"
      style={{ width: '100%', height: '100vh', overflow: 'scroll'}}
      onScroll={handleScroll}
    >
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
        <ConnectionLineRenderer />
        <WhiteboardGrid gridMargin={gridMargin} />
      </div>
    </div>
  );
}
