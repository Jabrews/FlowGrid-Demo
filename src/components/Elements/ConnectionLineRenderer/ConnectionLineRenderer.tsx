import { useEffect, useRef } from "react";
import { usePairFactoryContext } from "../../Context/PairFactory/PairFactoryContext";
import { useConnectionLinesContext } from "../../Context/ConnectionLines/ConnectionLines";

export default function ConnectionLineRenderer() {
  const svgRef = useRef<SVGSVGElement>(null);

  const pairStore = usePairFactoryContext();
  const connectedItems = pairStore((state) => state.connectedItems);

  const lineStore = useConnectionLinesContext();
  const elementRefs = lineStore((state) => state.elementRefs);
  const pausedLineId = lineStore((state) => state.pausedLineId);
  const isScrolling = lineStore((state) => state.isScrolling);
  const refreshLines = lineStore((state) => state.refreshLineElems);
  const lineElems = lineStore((state) => state.lineElems);
  const setLineElems = lineStore((state) => state.setLineElems);

  useEffect(() => {
    const handleResize = () => {
      refreshLines(connectedItems); 
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [refreshLines, connectedItems]);


  useEffect(() => {
    if (isScrolling) {
      refreshLines(connectedItems);
    }
  }, [isScrolling, refreshLines]);

  return (
    <svg
      ref={svgRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >

      {lineElems.map((pos, idx) => {


        const { inputRect, outputRect, trackerId, itemId } = pos;
        const isPaused =
          pausedLineId === trackerId || pausedLineId === itemId;

        if (!inputRect || !outputRect || isPaused || !svgRef.current) return null;

        const svgBounds = svgRef.current.getBoundingClientRect();

        const x1 = outputRect.left + outputRect.width / 2 - svgBounds.left;
        const y1 = outputRect.top + outputRect.height / 2 - svgBounds.top;
        const x2 = inputRect.left + inputRect.width / 2 - svgBounds.left;
        const y2 = inputRect.top + inputRect.height / 2 - svgBounds.top;

        return (
          <line
            key={`${trackerId}-${itemId}-${idx}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}
