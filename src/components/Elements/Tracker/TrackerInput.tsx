import { useDraggable } from '@dnd-kit/core';
import { useDndContext } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export type TrackerInputProps = {
    parentElementId: string;
    id: string;
    type: string;
};

export default function TrackerInput({ parentElementId, id, type }: TrackerInputProps) {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: {
            type,
            parentElementId : parentElementId,
            isTrackerInput: true  
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        cursor: 'grab',
    };

    const { active } = useDndContext();

    return (
        <div className='tracker-input'>
            <div
                ref={setNodeRef}
                style={style}
                {...listeners} {...attributes}
            >
                <svg width="20" height="20">
                    <circle cx="10" cy="10" r="10" fill="blue" />
                </svg>

                <p> Connected to : {parentElementId}</p>
            </div>
        </div>
    );
}
