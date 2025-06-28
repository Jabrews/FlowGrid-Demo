import { useConnectionToggleModalStore } from "../../Context/Modals/ConnectionToggleModalContext"
import ConnectionToggleModal from "../Modals/ConnectionToggleModal"
import TimeoutModel from "../Modals/TimeoutModel"
import { useTimeoutModalContext } from "../../Context/Modals/TimeoutModalContext"
import DeleteElementModel from "../Modals/DeleteElementModel"
import { useDeleteElementModalContext } from "../../Context/Modals/DeleteElementModalContext"


export default function ModalRenderer() {

    // connectionToggleStore
    const connectionToggleStore = useConnectionToggleModalStore()
    const showConnectionToggleModal = connectionToggleStore((state) => state.showModal)
    // TimeoutStore 
    const timeoutStore = useTimeoutModalContext()
    const showTimeoutModal = timeoutStore((state) => state.showModal)
    // DeleteStore
    const deleteElemStore = useDeleteElementModalContext()
    const showDeleteElemModal = deleteElemStore((state) => state.showModal)

    return (
    <>
        {showConnectionToggleModal && <ConnectionToggleModal />}
        {showTimeoutModal && <TimeoutModel />}
        {showDeleteElemModal && <DeleteElementModel />}

    </>
    );

}