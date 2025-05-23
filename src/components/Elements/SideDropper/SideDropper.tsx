import { useState } from 'react';
import DroppableItemList from '../SideDropper/DroppableItemList';

export default function SideDropper() {
  const [sideOpen, setSideOpen] = useState(true);

  return (
    <div className={`side-dropper-container ${sideOpen ? 'active' : ''}`}
    >
      <div className="side-dropper-header">
        <h2>{sideOpen ? 'Side Dropper' : ''}</h2>
        <h2 className="close-icon" onClick={() => setSideOpen(!sideOpen)}>
          {sideOpen ? 'X' : 'O'}
        </h2>
      </div>
      <div className="side-dropper-content">
        <DroppableItemList />
      </div>
    </div>
  );
}
