import { useEffect } from 'react';

export function useEdgeAutoScroll(
  isDragging: boolean,
  containerRef: React.RefObject<HTMLDivElement>
) {
  useEffect(() => {
    if (!isDragging || !containerRef.current) return;

    const SCROLL_SPEED = 30;
    const EDGE = 50;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const mouse = { x: e.clientX, y: e.clientY };
      const rect = containerRef.current!.getBoundingClientRect();

      const nearEdge = {
        left: mouse.x - rect.left < EDGE,
        right: rect.right - mouse.x < EDGE,
        top: mouse.y - rect.top < EDGE,
        bottom: rect.bottom - mouse.y < EDGE,
      };

      scrollIfNeeded(nearEdge);
    };

    const scrollIfNeeded = (nearEdge: Record<string, boolean>) => {
      const el = containerRef.current;
      if (!el) return;

      const scroll = () => {
        if (nearEdge.left) el.scrollLeft -= SCROLL_SPEED;
        if (nearEdge.right) el.scrollLeft += SCROLL_SPEED;
        if (nearEdge.top) el.scrollTop -= SCROLL_SPEED;
        if (nearEdge.bottom) el.scrollTop += SCROLL_SPEED;

        animationFrameId = requestAnimationFrame(scroll);
      };

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(scroll);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging, containerRef]);
}
