import { useEffect } from 'react';

export function useScrollFollow(
  isScrolling: boolean,
  getDelta: () => { x: number; y: number },
  ref: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!isScrolling || !ref?.current) return;

    let frameId: number;

    const scrollLoop = () => {
      const delta = getDelta();
      ref.current!.scrollLeft -= delta.x;
      ref.current!.scrollTop -= delta.y;
      frameId = requestAnimationFrame(scrollLoop);
    };

    frameId = requestAnimationFrame(scrollLoop);

    return () => cancelAnimationFrame(frameId);
  }, [isScrolling, ref, getDelta]);
}
