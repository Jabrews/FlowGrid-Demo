import { useEffect, useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';

// components
import WhiteboardGrid from './WhiteboardGrid';
import type { DroppedItem } from '../../Context/ItemFactory/ItemFactoryContext';
import ConnectionLineRenderer from '../ConnectionLineRenderer/ConnectionLineRenderer';
import ModalRenderer from '../ModalRenderer/ModalRenderer';
import FakeCursor from '../FakeCursor/FakeCursor';

// Item Factory
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';

// line factory context (for scrolling)
import { useConnectionLinesContext } from '../../Context/ConnectionLines/ConnectionLines';

export default function Whiteboard() {
  const [gridMargin, setGridMargin] = useState<[number, number]>([100, 150]);

  // for mouse scrolling
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseAnchorPos, setMouseAnchorPos] = useState({ x: 0, y: 0 });
  const [isScrolling, toggleIsScrolling] = useState(false);
  const whiteboardRef = useRef<HTMLDivElement>(null);

  // calculate mouse position (x, y) in whiteboard 
  const calcRelativeMousePos = (e: MouseEvent) => {
    if (whiteboardRef.current) {
      const whiteboardPos = whiteboardRef.current.getBoundingClientRect();
      const mouseX = e.clientX - whiteboardPos.left;
      const mouseY = e.clientY - whiteboardPos.top;
      return { x: mouseX, y: mouseY };
    }
  };

  // handle scroll start
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        const relativeMousePos = calcRelativeMousePos(e);
        if (relativeMousePos) {
          setMouseAnchorPos(relativeMousePos);
          toggleIsScrolling(true);
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        setMouseAnchorPos({ x: 0, y: 0 });
        setMousePos({ x: 0, y: 0 });
        toggleIsScrolling(false);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // difference between anchor and current mouse position
  const calcAnchorDiffrenceFromCurrent = (currentMousePos: { x: number, y: number }) => {
    const dx = currentMousePos.x - mouseAnchorPos.x;
    const dy = currentMousePos.y - mouseAnchorPos.y;
    return { x: dx, y: dy };
  };

  // scroll the whiteboard
  const scrollWhiteboard = (mouseDiffrencePos: { x: number, y: number }) => {
    const SCROLL_SPEED = 0.05;
    if (whiteboardRef.current) {
      whiteboardRef.current.scrollLeft -= mouseDiffrencePos.x * SCROLL_SPEED;
      whiteboardRef.current.scrollTop -= mouseDiffrencePos.y * SCROLL_SPEED;
    }
  };

  // scrolling logic when middle mouse is held
  useEffect(() => {
    if (isScrolling) {
      const handleMouseMove = (e: MouseEvent) => {
        const currentMousePos = calcRelativeMousePos(e);
        if (currentMousePos) {
          const mouseDiffrencePos = calcAnchorDiffrenceFromCurrent(currentMousePos);
          scrollWhiteboard(mouseDiffrencePos);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove); // ✅ correct event cleanup
      };
    }
  }, [isScrolling]);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lineStore = useConnectionLinesContext();
  const clearLineRects = lineStore((state) => state.clearLineRects);
  const restoreLineRects = lineStore((state) => state.restoreLineRects);

  const handleScroll = () => {
    clearLineRects();

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      restoreLineRects();
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
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'scroll',
        cursor: isScrolling ? 'none' : 'default',
      }}
      onScroll={handleScroll}
      ref={whiteboardRef}
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
        <FakeCursor visible={isScrolling} position={mouseAnchorPos} />
        <ConnectionLineRenderer />
        <ModalRenderer />
        <WhiteboardGrid gridMargin={gridMargin} />
      </div>
    </div>
  );
}
