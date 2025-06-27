import { useConnectionToggleModalStore } from "../../Context/Modals/ConnectionToggleModalContext"
import ConnectionToggleModal from "../ConnectionToggleModal/ConnectionToggleModal"


export default function ModalRenderer() {

    // connectionToggleStore
    const connectionToggleStore = useConnectionToggleModalStore()
    const showConnectionToggleModal = connectionToggleStore((state) => state.showModal)

    return (
    <>
        {showConnectionToggleModal && <ConnectionToggleModal />}
    </>
    );

}