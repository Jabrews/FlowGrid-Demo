import { useEffect, useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';

// components
import WhiteboardGrid from './WhiteboardGrid';
import ConnectionLineRenderer from '../ConnectionLineRenderer/ConnectionLineRenderer';
import ModalRenderer from '../ModalRenderer/ModalRenderer';
import FakeCursor from '../FakeCursor/FakeCursor';

// contexts
import { useItemFactoryContext } from '../../Context/ItemFactory/ItemFactoryContext';
import { useConnectionLinesContext } from '../../Context/ConnectionLines/ConnectionLines';

export default function Whiteboard() {
  const [gridMargin, setGridMargin] = useState<[number, number]>([100, 150]);
  const [mouseAnchorPos, setMouseAnchorPos] = useState({ x: 0, y: 0 });
  const [isScrolling, toggleIsScrolling] = useState(false);
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const currentMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // helper: clamp
  const clamp = (val: number, max: number) => Math.max(-max, Math.min(val, max));

  // start scroll
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        setMouseAnchorPos({ x: e.clientX, y: e.clientY });
        toggleIsScrolling(true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
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

  // update current mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      currentMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    if (isScrolling) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isScrolling]);

  // animation loop scroll
  useEffect(() => {
    if (!isScrolling) return;

    const speed = 0.25;
    const maxDelta = 25;

    const loop = () => {
      if (whiteboardRef.current) {
        const { x: ax, y: ay } = mouseAnchorPos;
        const { x: mx, y: my } = currentMousePosRef.current;

        const dx = clamp((mx - ax) * speed, maxDelta);
        const dy = clamp((my - ay) * speed, maxDelta);

        whiteboardRef.current.scrollLeft -= dx;
        whiteboardRef.current.scrollTop -= dy;
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isScrolling, mouseAnchorPos]);

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