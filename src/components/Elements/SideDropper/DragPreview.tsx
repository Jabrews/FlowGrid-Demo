export type DragPreviewProps = {
  type : string
};

export default function DragPreview({ type}: DragPreviewProps) {
  return (
    <div 
      className='Drag-Preview'
      style={{
        width: '100px', // ✅ same size as original item
        height: '100px',
        backgroundColor: type == 'tracker-input' ? 'blue' : 'orange',
        borderRadius: '8px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none', // ✅ ensures it's not blocking interaction
        transform: 'translate(-50%, -50%)', // ✅ optional: shift to center it on cursor
      }}
    >
      Dragging {type}
    </div>
  );
}
