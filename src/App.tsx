import { useState } from 'react'

// Modal
import { ModalProvider } from "./components/Elements/CenterModel/CenterModelContext";
import TimeoutModel from "./components/Elements/CenterModel/TimeoutModel";
import './styles/main.css';

// components :
import Whiteboard from "./components/Elements/Whiteboard/Whiteboard";
import SideDropper from "./components/Elements/SideDropper/SideDropper";
function App() {

  return (
    <>
    <SideDropper />
      <ModalProvider>
        <>
          <TimeoutModel /> {/* ⬅️ will only render if context is triggered */}
          <Whiteboard />
        </>
      </ModalProvider>    
    </>
  )
}

export default App
