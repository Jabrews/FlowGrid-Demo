import { useState } from 'react'

// tracker menus
import TrackerTimerMenu from "./TrackerMenus/TrackerTimerMenu"

export default function Tracker() {
    const [showDropdown, toggleDropdown] = useState(false)





    return (

        <div className='tracker-container'>
       {/* Tracker Header */}
            <div className='tracker-header'>
                <button> &lt; </button>
                <button> &gt; </button>
            </div>

       {/* Tracker Content */}
        <div 
        className='tracker-menu-container'
        >
            <div className='tracker-menu-header' style={{overflow: 'visible'}}>
                <p> Connceted to : [Insert Output Parent]</p>
            </div>

            <div className="tracker-menu-content"> 
                <TrackerTimerMenu />
            </div>

        </div>


        </div>
    )   
}