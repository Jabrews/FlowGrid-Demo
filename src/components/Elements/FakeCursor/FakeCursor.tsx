type FakeCursorProps = {
  visible: boolean;
  position: { x: number; y: number };
};

export default function FakeCursor({ visible, position }: FakeCursorProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',             // fixes it to viewport, not document flow
        left: position.x,
        top: position.y,
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
