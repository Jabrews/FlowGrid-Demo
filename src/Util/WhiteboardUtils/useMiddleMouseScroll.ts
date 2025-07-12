import { useEffect } from 'react';

export function useMiddleMouseScroll(
  isScrolling: boolean,
  setIsScrolling: (v: boolean) => void,
  setAnchor: (pos: { x: number; y: number }) => void,
  updatePos: (pos: { x: number; y: number }) => void
) {
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        setAnchor({ x: e.clientX, y: e.clientY });
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
      if (isScrolling) {
        updatePos({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isScrolling, setIsScrolling, setAnchor, updatePos]);
}