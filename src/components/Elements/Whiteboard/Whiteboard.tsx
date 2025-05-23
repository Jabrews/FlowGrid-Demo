import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import GridLayout from 'react-grid-layout';
import type {Layout} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import Timer from '../Timer/Timer';
import { useDroppable } from '@dnd-kit/core';

// delete element model
import { useDeleteModal } from '../DeleteElementModel/DeleteElementModelContext';

export type DroppedItem = {
  id: string;
  content: string;
  type: string;
};

type WhiteboardProps = {
  droppedItems: DroppedItem[];
  setDroppedItems: React.Dispatch<React.SetStateAction<DroppedItem[]>>;

};

export default function Whiteboard({ droppedItems, setDroppedItems }: WhiteboardProps) {
  const { setNodeRef } = useDroppable({ id: 'droppable-1' });
    const { open } = useDeleteModal(); // Access the modal context

  const componentMap: Record<string, JSX.Element> = {
    Timer: <Timer />,
    Chart: <div>Chart Component</div>,
    Note: <div>Note Component</div>,
  };

  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {
    const newLayout = droppedItems.map((item, index) => ({
      i: item.id,
      x: (index % 6) * 4,
      y: Math.floor(index / 6) * 2,
      w: 3,
      h: 2,
    }));
    setLayout(newLayout);
  }, [droppedItems]);

  return (
    <div className="whiteboard" style={{ width: '100%', height: '100vh', overflow: 'scroll' }}>
      <div
        ref={setNodeRef}
        style={{
          width: '100%',
          height: '100%',
        }}
        className="droppable-div"
      >
        <GridLayout
          layout={layout}
          cols={24}
          rowHeight={100}
          width={2000}
          margin={[100, 150]}
          preventCollision={false}
          draggableHandle=".drag-handle"
          isResizable={false}
        >
          {droppedItems.map((item) => (
            <div key={item.id} className="whiteboard-item">
              <div className="item-header">
                <div className="drag-handle">::</div>
                <div
                  className="delete-handle"
                  onClick={() =>
                    open(item.id, () => {
                      setDroppedItems((prev) => prev.filter((e) => e.id !== item.id));
                    })
                  }

                >
                  X
                </div>
              </div>
              {componentMap[item.type] || <p>Unknown component</p>}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
