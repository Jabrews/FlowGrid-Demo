import { useEffect, useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';

// components
import WhiteboardGrid from './WhiteboardGrid';
import ConnectionLineRenderer from '../ConnectionLineRenderer/ConnectionLineRenderer';
import ModalRenderer from '../ModalRenderer/ModalRenderer';
import FakeCursor from '../FakeCursor/FakeCursor';

// contexts
import { useConnectionLinesContext } from '../../Context/ConnectionLines/ConnectionLines';
import { useViewportPanStore } from '../../Context/ViewportPan/ViewportPanContext';
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';

export default function Whiteboard() {
  const [gridMargin, setGridMargin] = useState<[number, number]>([100, 150]);


  // for loading whiteboard ref into viewport context
const localWhiteboardRef = useRef<HTMLDivElement | null>(null);

  // viewport pan store
  const viewportStore = useViewportPanStore() 
  const {
    isScrolling,
    mouseAnchorPos,
    setIsScrolling,
    setMouseAnchorPos,
    updateCurrentMousePos,
    getScrollDelta, 
  } = viewportStore((state) => state)

  const droppedItemStore = useItemFactoryContext()
  const {
    whiteboardRef,
    setWhiteboardRef,
  } = droppedItemStore((state) => state)

  useEffect(() => {
    if (localWhiteboardRef != null) {
      setWhiteboardRef(localWhiteboardRef);
    }
  }, [setWhiteboardRef, localWhiteboardRef]);

    useEffect(() => {
      const handleMouseDown = (e: MouseEvent) => {
        if (e.button === 1) {
          e.preventDefault();
          setMouseAnchorPos({ x: e.clientX, y: e.clientY });
          setIsScrolling(true);
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 1) {
          e.preventDefault();
          setIsScrolling(false);
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        updateCurrentMousePos({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      if (isScrolling) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      return () => {
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [isScrolling, setMouseAnchorPos, setIsScrolling, updateCurrentMousePos]);

    useEffect(() => {
      if (!isScrolling || !whiteboardRef?.current) return;

      let frameId: number;

      const scrollLoop = () => {
        const delta = getScrollDelta();
        whiteboardRef.current!.scrollLeft -= delta.x;
        whiteboardRef.current!.scrollTop -= delta.y;
        frameId = requestAnimationFrame(scrollLoop);
      };

      frameId = requestAnimationFrame(scrollLoop);

      return () => cancelAnimationFrame(frameId);
    }, [isScrolling, whiteboardRef, getScrollDelta]);


    // line render debounce
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

  // resize handling
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
        width: '100vw',
        height: '100vh',
        cursor: isScrolling ? 'none' : 'default',
      }}
      onScroll={handleScroll}
      ref={localWhiteboardRef}
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
        <FakeCursor/>
        <ConnectionLineRenderer />
        <ModalRenderer />
        <WhiteboardGrid gridMargin={gridMargin} />
      </div>
    </div>
  );
}