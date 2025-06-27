import { useDroppable } from '@dnd-kit/core';
import { useConnectionToggleModalStore } from '../../Context/Modals/ConnectionToggleModalContext';
import { usePairFactoryContext } from '../../Context/PairFactory/PairFactoryContext';

type TrackerOutputProps = {
  parentElementId: string;
  id: string;
  type: string;
};



export default function TrackerOutput({ parentElementId, id, type }: TrackerOutputProps) {

  // connectionToggleModalStore 
  const connectionToggleStore = useConnectionToggleModalStore()
  const toggleShowModal = connectionToggleStore((state) => state.toggleShowModal)
  // pairFactoyStore
  const pairFactoryStore = usePairFactoryContext()
  const connectedItems = pairFactoryStore((state) => state.connectedItems)

  const handleToggleConnectionModal = () => {
    connectedItems.map((item) => {
      if (item.item.id == parentElementId) {
        toggleShowModal(true)
        return
      }
      else {
        console.log('could not find linked pair for toggling connection modal')
      }
    })
    
  }

  const { setNodeRef } = useDroppable({
    id,
    data: { type, parentElementId },
  });

  return (
    <div className="tracker-output" ref={setNodeRef}>
      <svg width="20" height="20" onClick={handleToggleConnectionModal}>
        <circle cx="10" cy="10" r="10" fill="red" />
      </svg>
      <p>Output ID: {id}</p>
    </div>
  );
}
