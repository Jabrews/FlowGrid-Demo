

//   .whiteboard-item {
//     margin : 0.5em;


//     height: 100%;
//     width: 100%;
//     box-sizing: border-box;
//     padding: 1em;
//     border-radius: 10px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     font-family: monospace;



export default function DroppableItemList() {


    return (
        
        <div className='drop-item-list-container'> 
            <div>
                <p> Item 1</p>
                <div className='placeholder-image' > </div>
            </div>
            <div>
                <p> Item 2 </p>
            </div>
            <div>
                <p> Item 3 </p>
            </div>
        </div>


    )

}