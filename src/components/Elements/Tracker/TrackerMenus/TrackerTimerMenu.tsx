
import {useState} from 'react';

// Fields
import FieldCounter from './TrackerMenuFields/FieldCounter'
import type { FieldCounterProps } from './TrackerMenuFields/FieldCounter';




export default function TrackerTimerMenu() {
    
    /* Add Dropdown */
    const [showDropdown, toggleDropdown] = useState(false)
    /* Manage active Fields for Timer menu  */ /* Only need to worry about DropDownCounters*/
    const [fields, setFields] = useState<FieldCounterProps[]>([]);

    /* Field Options */
    const fieldOptions = [
        { is_dropdown: true, title: 'Elapsed Time', label: 'Daily', drop_down_list: ['Daily', 'Weekly', 'Monthly', 'Yearly'] },
        { is_dropdown : false, title: 'Daily Streak', label: 'Streak', drop_down_list : ['']}
    ]



    return (    

        <div
        className='timer-menu-container'
        >

        {/* Dropdown Menu */}
        <div className='drop-down-menu-container'> 
            <button className='add-btn' onClick={() => toggleDropdown(prev => !prev)}> + </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className='drop-down-menu'>


                    {/* FUTURE JACOB : whenever adding new types of fields make sure to include if else statements for logic*/}

                    {fieldOptions.map((item, idx) => (
                        <div
                            key={idx}
                            className='drop-down-item'
                            onClick={() => {

                                {/* LOGIC FOR  ADDING ITEMS TO MENU */}
                                toggleDropdown(false);
                                {/* Only need to worry about adding DropdownCounters*/}
                                setFields(prev => [
                                    ...prev,
                                    { is_dropdown: item.is_dropdown, title: item.title, label: item.label, drop_down_list: item.drop_down_list }
                                ]);
                            }}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            )}

        </div>

        {fields.map((field, idx) => (
            <div key={idx} className='timer-menu-item'>
                <FieldCounter
                    is_dropdown={field.is_dropdown}
                    title={field.title}
                    label={field.label}
                    drop_down_list={field.drop_down_list}
                />
                <button 
                    className='timer-menu-delete-btn'
                    onClick={() => setFields(fields.filter((_, i) => i !== idx))}
                >
                    X
                </button>
            </div>
        ))}
        
        </div>

    )

}