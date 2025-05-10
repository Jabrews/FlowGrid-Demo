// grid stuff 
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
// zoom wrapper 
import {TransformWrapper, TransformComponent, useControls} from "react-zoom-pan-pinch";
// components
import Timer from '../Timer/Timer';

export default function Whiteboard() {

  // grid layout (positions, size, and keys must match)
  const layout = [
    { i: "a", x: 0, y: 0, w: 3, h: 2 },
    { i: "b", x: 3, y: 0, w: 3, h: 2 },
    { i: "c", x: 0, y: 2, w: 3, h: 2 },
    { i: "d", x: 3, y: 2, w: 3, h: 2 },
  ];

  ///// zoom controls



  return (
    <div className="whiteboard">
      <TransformWrapper
        initialScale={1}
        panning={{ disabled: true }}   
        doubleClick={{ disabled: true }}
        wheel={{disabled: true}}    
      >
        <TransformComponent>
          <div style={{ minWidth: 1000, minHeight: 800 }}>
            
            {/* ZOOM CONTROLS */}
            <div className="tools">
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>x</button>
            </div>
            
            {/* GRID LAYOUT */}
            <GridLayout
              layout={layout}
              cols={24}
              rowHeight={100}
              width={1000}
              margin={[50, 50]}
              compactType="vertical"
              preventCollision={false}
              isResizable={true}
            >
              {/* COMPONENTS */}
              <div key="a" className='whiteboard-item'>
                <Timer />
              </div>  
              <div key="b" className='whiteboard-item'>Example B</div>
              <div key="c" className='whiteboard-item'>Example C</div>
              <div key="d" className='whiteboard-item'>Example D</div>
            </GridLayout>
          </div>
        </TransformComponent>
    </TransformWrapper>
    </div>
  );
}