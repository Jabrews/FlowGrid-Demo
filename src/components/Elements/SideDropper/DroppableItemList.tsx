import DraggableItem from './DraggableItem';

export default function DroppableItemList() {
  return (
    <div className="drop-item-list-container">
      <DraggableItem id='Timer' type='Timer'/>
      <DraggableItem id='Chart' type='Chart'/>
      <DraggableItem id='Tracker' type='Tracker'/>
      <DraggableItem id='Note-List' type='Note-List' />
    </div>
  );
}
