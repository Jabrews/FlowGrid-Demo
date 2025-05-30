import { useDraggable} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities'

export type TrackerInputProps = {
    parentElementId : string;
    id: string;
    type : string;
};


export default function TrackerInput({parentElementId, id, type} : TrackerInputProps) {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
        type,    }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        cursor: 'grab',
    };


    return (
        <div className='tracker-input'>
            <div 
            ref={setNodeRef} 
            style={style}
            >
                <svg width="20" height="20" {...listeners} {...attributes}>
                    <circle cx="10" cy="10" r="10" fill="blue" />
                </svg>

                <p> Connected to : {parentElementId}</p>
            </div>
        </div>

    )


}