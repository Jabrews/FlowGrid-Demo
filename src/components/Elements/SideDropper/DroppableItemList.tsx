import DraggableItem from './DraggableItem';

export default function DroppableItemList() {
  return (
    <div className="drop-item-list-container">
      <DraggableItem id="Timer" />
      <DraggableItem id="Chart" />
      <DraggableItem id="Note" />
    </div>
  );
}
