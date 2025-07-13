import { motion } from 'framer-motion';
import { useDeleteElementModalContext } from '../../../Context/Modals/DeleteElementModalContext';


// context for deleting elements
import { usePairFactoryContext } from '../../../Context/PairFactory/PairFactoryContext';
import { useItemFactoryContext } from '../../../Context/ItemFactory/ItemFactoryContext';
import { useTimerMenuContext } from '../../../Context/TrackerMenusContext/TimerMenuContext';
import { useConnectionLinesContext } from '../../../Context/ConnectionLines/ConnectionLines';

export default function DeleteElementModel() {

  // stores
  const itemFactoryStore = useItemFactoryContext();
  const pairFactoryStore = usePairFactoryContext();
  const timerMenuStore = useTimerMenuContext();
  
  const connectionLinesContext = useConnectionLinesContext()
  const connectedItems = pairFactoryStore((state) => state.connectedItems)

  // delete elem modal
  const deleteElementModalStore = useDeleteElementModalContext()
  const toggleShowModal = deleteElementModalStore((state) => state.toggleShowModal)
  const setTargetId = deleteElementModalStore((state) => state.setTargetId)
  const targetId = deleteElementModalStore((state) => state.targetId)


  const deleteElement = () => {
    itemFactoryStore.getState().removeDroppedItem(targetId);
    pairFactoryStore.getState().removeConnectedItem(targetId);
    timerMenuStore.getState().removeTimerPairByItemId(targetId);

    // refresh lines
    connectionLinesContext.getState().refreshLineElems(connectedItems)
  };


  const handleDelete = () => {
    deleteElement()
    setTargetId('')
    toggleShowModal(false)
  };

  const handleCancel = () => {
    setTargetId('')
    toggleShowModal(false)
  };

  return (
    <motion.div className="center-modal" drag dragMomentum={false}>
      <p>Are you sure you want to delete: <strong>{targetId}</strong>?</p>
      <button onClick={handleDelete} onTouchStart={handleDelete}>Yes</button>
      <button onClick={handleCancel} onTouchStart={handleCancel}>No</button>
    </motion.div>
  );
}
