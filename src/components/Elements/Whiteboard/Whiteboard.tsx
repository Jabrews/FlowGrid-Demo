import { useState } from 'react';
// grid stuff 
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
// components
import Timer from '../Timer/Timer';

export default function Whiteboard() {
  // state for handling panning or dragging 

  const layout = [
    { i: "a", x: 0, y: 0, w: 3, h: 2 },
    { i: "b", x: 3, y: 0, w: 3, h: 2 },
    { i: "c", x: 0, y: 2, w: 3, h: 2 },
    { i: "d", x: 3, y: 2, w: 3, h: 2 },
  ];

  return (
    <div
      className="whiteboard"
      style={{
        width: "100%",
        height: "100vh",
        overflow: "auto",
        position: "relative",
      }}
    >
      {/* grid layout */}
      <div style={{ minWidth: 2000, minHeight: 2000 }}>
        <GridLayout
          layout={layout}
          cols={24}
          rowHeight={100}
          width={2000}
          margin={[100, 100]}
          compactType="vertical"
          preventCollision={false}
          draggableHandle=".drag-handle"
          isResizable={false}
        >
          {/* grid items */}
          <div key="a" className='whiteboard-item'>
            <div className="drag-handle">:: drag</div>
            <Timer />
          </div>

          <div key="b" className='whiteboard-item'>
            <div className="drag-handle">:: drag</div>
            Example B
          </div>

          <div key="c" className='whiteboard-item'>
            <div className="drag-handle">:: drag</div>
            Example C
          </div>

          <div key="d" className='whiteboard-item'>
            <div className="drag-handle">:: drag</div>
            Example D
          </div>
        </GridLayout>
      </div>
    </div>
  );
}
