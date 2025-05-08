import { useState } from 'react'

// Modal
import { ModalProvider } from "./components/Elements/CenterModel/CenterModelContext";
import TimeoutModel from "./components/Elements/CenterModel/TimeoutModel";
import './styles/main.css';

// components :
import Whiteboard from "./components/Elements/Whiteboard/Whiteboard";

function App() {

  return (
    <>
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
