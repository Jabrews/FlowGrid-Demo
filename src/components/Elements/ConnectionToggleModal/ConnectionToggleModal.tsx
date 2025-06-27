import {motion} from 'framer-motion'
import { useConnectionToggleModalStore } from '../../Context/Modals/ConnectionToggleModalContext'
import { useEffect } from 'react'

export default function ConnectionToggleModal() {

    // open, close, toggleItem, complete} 
    const connectionToggleModalStore = useConnectionToggleModalStore() 
    const { showModal, toggleShowModal } = connectionToggleModalStore((state) => state);


    const handleCloseModal = () => {
        toggleShowModal(false)
    }

    return (
        <>
            { showModal == true 
                ? (
                    <motion.div className="center-modal" drag dragMomentum={false}>
                        <p> you feeling it now ...</p>
                        <button onClick={handleCloseModal}> Close modal </button>
                    </motion.div> 
                ) 
                :(
                    <div></div>
                )
            }
        </>
    

    )
}