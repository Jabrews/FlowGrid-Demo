import { motion } from 'framer-motion';
import { useDeleteModal } from './DeleteElementModelContext';

export default function DeleteElementModel() {
  const { show, confirm, cancel, targetId } = useDeleteModal();

  if (!show) return null;

  const handleDelete = () => {
    confirm(); // this runs the onConfirm callback
  };

  const handleCancel = () => {
    cancel(); // just closes the modal, does nothing else
  };

  return (
    <motion.div className="center-modal" drag dragMomentum={false}>
      <p>Are you sure you want to delete: <strong>{targetId}</strong>?</p>
      <button onClick={handleDelete} onTouchStart={handleDelete}>Yes</button>
      <button onClick={handleCancel} onTouchStart={handleCancel}>No</button>
    </motion.div>
  );
}
