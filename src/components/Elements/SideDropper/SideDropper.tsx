import { useState} from 'react';


// components
import DroppableItemList from '../SideDropper/DroppableItemList'


export default function SideDropper() {

    // icon open/close logic 
    const [sideOpen, setSideOpen] = useState(true);


    return (
        <div className='side-dropper-container'> 
            <div className='side-dropper-header'
            style={{
            gridTemplateColumns: sideOpen ? '1fr 1fr' : '1fr'
            }}
            >
                <h2>
                    {sideOpen == true ? 'Side Dropper' : '' } 
                </h2>
                {/* Icon */}
                <h2 className='close-icon'
                onClick={() => {
                    setSideOpen(!sideOpen);
                }}
                style={{
                marginLeft: sideOpen ? '5em' : '0em'
                }}
                > 
                {sideOpen == true ? 'X' : 'O' } 
                </h2>
            </div>

            <div 
            className='side-dropper-content'
            style={{
                display : sideOpen ? 'block' : 'none'
            }}
            > 

            <DroppableItemList />
        
        

            </div>

        </div>
    )


}