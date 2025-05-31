
import { useDroppable } from '@dnd-kit/core'
import {useState, useEffect} from 'react'


type TrackerOutputProps = {
    parentElementId : string;
    id : string;
    type : string;
}

export default function TrackerOutput({parentElementId, id, type} : TrackerOutputProps) {

    const [activated, setActivated] = useState(false);

    const { setNodeRef } = useDroppable({
    id: id, // real ID
    data: {
        type,
        parentElementId,
        isTrackerOutput: true,
    },
    });

    return ( 
        <div className='tracker-output'
        ref={setNodeRef}
        key={id}
        >
            <svg width="20" height="20">
                <circle
                    cx="10"
                    cy="10"
                    r="10"
                    fill={activated ? "red" : "#8B0000"} // red if activated, dark red otherwise
                />
            </svg>
            <p> Connected to : {parentElementId}</p>
        </div>
    )


}