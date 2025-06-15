import { useDroppable } from '@dnd-kit/core';

type TrackerOutputProps = {
  parentElementId: string;
  id: string;
  type: string;
};

export default function TrackerOutput({ parentElementId, id, type }: TrackerOutputProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: { type, parentElementId },
  });

  return (
    <div className="tracker-output" ref={setNodeRef}>
      <svg width="20" height="20">
        <circle cx="10" cy="10" r="10" fill="red" />
      </svg>
      <p>Output ID: {id}</p>
    </div>
  );
}
