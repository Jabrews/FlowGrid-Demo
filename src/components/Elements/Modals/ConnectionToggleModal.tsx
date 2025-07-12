import {motion} from 'framer-motion'
import { useConnectionToggleModalStore } from '../../../Context/Modals/ConnectionToggleModalContext';
import { usePairFactoryContext } from '../../../Context/PairFactory/PairFactoryContext';
import { useConnectionLinesContext } from '../../../Context/ConnectionLines/ConnectionLines';
import { useEffect } from 'react';


export default function ConnectionToggleModal() {

    // connectionToggleModal store
    const connectionToggleModalStore = useConnectionToggleModalStore() 
    const { parentItemId, toggleShowModal, toggleObjects, updateToggleObjects, clearToggleObjects, toggleChecked, disconnectItems} = connectionToggleModalStore((state) => state);
    // pairFactoryContext store
    const pairFactoryStore = usePairFactoryContext()
    const connectedItems = pairFactoryStore((state) => state.connectedItems)

    useEffect(() => {
       updateToggleObjects(connectedItems, parentItemId)  
    }, [parentItemId, connectedItems, updateToggleObjects])




    const handleCloseModal = () => {
        toggleShowModal(false)
        clearToggleObjects()
    }

    const handleToggleConnection = (toggleId: string) => {
        toggleChecked(toggleId)
    }

    const handleDisconnection = () => {
        disconnectItems()
        clearToggleObjects()
        toggleShowModal(false)
    }



    return (
        <>
            <motion.div className="center-modal" drag dragMomentum={false}>
                <div className='modal-connection-container'>
                    <ul className='modal-connection-list'>
                        {
                         toggleObjects.map((object) => {
                            return (
                                <li className='modal-connection-item' key={`${object.toggleId}`}> 
                                    <input 
                                        className='modal-checkbox'
                                        type='checkbox' 
                                        checked={object.checked}
                                        onChange={() => handleToggleConnection(object.toggleId)}
                                    />
                                    <p className='modal-connection-label'> {object.toggleId} </p>  
                                    <span> {` ${object.trackerConnections.toString()} `} </span> {/* number needs to represent how many connected objects to this object there are*/}
                                </li>
                            )
    
                         })



                        }
                                            </ul>
                </div>
                <button onClick={handleCloseModal}> Close </button>
                <button onClick={handleDisconnection}> Confirm </button>
            </motion.div>
        </>
    

    )
}