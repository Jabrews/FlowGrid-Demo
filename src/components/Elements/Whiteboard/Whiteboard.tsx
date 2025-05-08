import { useRef } from 'react';

// components
import Dragable from '../Dragable/Dragable';
import Timer from '../Timer/Timer';

export default function Whiteboard() {
    const canvasRef = useRef<HTMLDivElement>(null);


    return (
      <div className="whiteboard">
        <div className="canvas" ref={canvasRef}>
          <Dragable dragConstraints={canvasRef}>
            <Timer />
          </Dragable>
        </div>
      </div>
    );
  }