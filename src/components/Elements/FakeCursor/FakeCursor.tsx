import { useViewportPanStore } from "../../Context/ViewportPan/ViewportPanContext";

export default function FakeCursor() {
  
  
  const viewportPanStore = useViewportPanStore()
  const {mouseAnchorPos, isScrolling} = viewportPanStore((state) => state)


  if (!isScrolling) return null;


  return (
    <div
      style={{
        position: 'fixed',             // fixes it to viewport, not document flow
        left: mouseAnchorPos.x,
        top: mouseAnchorPos.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0L6 24L10 14L20 18L0 0Z" />
      </svg>
    </div>
  );
}
