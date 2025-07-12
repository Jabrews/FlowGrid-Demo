import { useEffect, useState } from 'react';

type MousePosition = {
  x: number;
  y: number;
};

export function useMousePosition(isActive: boolean): MousePosition | null {
  const [position, setPosition] = useState<MousePosition | null>(null);

  useEffect(() => {
  if (!isActive) return;

  let animationFrameId: number;

  const handleMouseMove = (e: MouseEvent) => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    animationFrameId = requestAnimationFrame(() => {
      setPosition({
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
      });
    });
  };

  window.addEventListener('mousemove', handleMouseMove);

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', handleMouseMove);
  };
}, [isActive]);


  return position;
}
