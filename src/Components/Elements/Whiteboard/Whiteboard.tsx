import { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';

import WhiteboardGrid from './WhiteboardGrid';
import ConnectionLineRenderer from '../ConnectionLineRenderer/ConnectionLineRenderer';
import ModalRenderer from '../ModalRenderer/ModalRenderer';
import FakeCursor from '../FakeCursor/FakeCursor';

import { useConnectionLinesContext } from '../../../Context/ConnectionLines/ConnectionLines';
import { useViewportPanStore } from '../../../Context/ViewportPan/ViewportPanContext';
import { useItemFactoryContext } from '../../../Context/ItemFactory/ItemFactoryContext';

import { useMousePosition } from '../../../Util/useMousePosition'
import { useMiddleMouseScroll } from '../../../Util/WhiteboardUtils/useMiddleMouseScroll.ts';
import { useScrollFollow } from '../../../Util/WhiteboardUtils/useScrollFollow.ts';

export default function Whiteboard() {
  const droppedItemStore = useItemFactoryContext();
  const gridMargin = droppedItemStore((s) => s.gridMargin);
  const updateGridMarginFromWindow = droppedItemStore((s) => s.updateGridMarginFromWindow);
  const { whiteboardRef, setWhiteboardRef } = droppedItemStore((s) => s);

  const localWhiteboardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (localWhiteboardRef.current) {
      setWhiteboardRef(localWhiteboardRef);
    }
  }, [setWhiteboardRef]);

  const [trackMouse, setTrackMouse] = useState(false);
  const mousePos = useMousePosition(trackMouse);

  const viewportStore = useViewportPanStore();
  const {
    isScrolling,
    setIsScrolling,
    setMouseAnchorPos,
    updateCurrentMousePos,
    getScrollDelta,
  } = viewportStore((s) => s);

  useMiddleMouseScroll(
    isScrolling,
    setIsScrolling,
    setMouseAnchorPos,
    updateCurrentMousePos
  );

  useScrollFollow(isScrolling, getScrollDelta, whiteboardRef);

  useEffect(() => {
    if (trackMouse) {
      updateCurrentMousePos(mousePos);
     }
  }, [mousePos, trackMouse, updateCurrentMousePos]);

  useEffect(() => {
    const handleResize = () => updateGridMarginFromWindow();
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [updateGridMarginFromWindow]);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lineStore = useConnectionLinesContext();
  const clearLineRects = lineStore((s) => s.clearLineRects);
  const restoreLineRects = lineStore((s) => s.restoreLineRects);

  const handleScroll = () => {
    clearLineRects();
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      restoreLineRects();
    }, 100);
  };

  const { setNodeRef } = useDroppable({ id: 'droppable-1' });

  return (
    <div
      className="whiteboard"
      style={{
        width: '100vw',
        height: '100vh',
        cursor: isScrolling ? 'none' : 'default',
        overflow: 'auto',
      }}
      onScroll={handleScroll}
      ref={localWhiteboardRef}
    >
      <div
        ref={setNodeRef}
        style={{
          margin: '0.5em',
          display: 'inline-block',
          width: '3000px',
          height: '3000px',
        }}
        className="droppable-div"
      >
        <FakeCursor />
        <ConnectionLineRenderer />
        <ModalRenderer />
        <WhiteboardGrid gridMargin={gridMargin} />
      </div>
    </div>
  );
}
