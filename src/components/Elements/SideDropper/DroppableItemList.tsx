import DraggableItem from './DraggableItem';

export default function DroppableItemList() {
  return (
    <div className="drop-item-list-container">
      <DraggableItem id='Timer' type='Timer'/>
      <DraggableItem id='Tracker' type='Tracker'/>
      <DraggableItem id='Note-List' type='Note-List' />
      <DraggableItem id='Table' type='Table' />
    </div>
    
  );
}
