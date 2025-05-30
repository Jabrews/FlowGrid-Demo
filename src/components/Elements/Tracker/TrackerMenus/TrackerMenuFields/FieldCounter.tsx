import { useState } from 'react'

export type FieldCounterProps = {
    is_dropdown : boolean
    title : string;
    label: string;
    drop_down_list: string[];
}

export default function FieldCounter({ is_dropdown, label, drop_down_list }: FieldCounterProps) {
    const [showDropdown, toggleDropdown] = useState(false)
    const [activeTimeFrame, toggleTimeFrame] = useState(label)

    return (

        <div className="drop-down-counter-container">

            {/* Dropdown menu if is_dropdown is true */}
            {is_dropdown ? (
            <div className="drop-down-menu-container">
                <button
                className="drop-down-btn"
                onClick={() => toggleDropdown((prev) => !prev)}
                type="button"
                >
                V
                </button>
                {showDropdown && (
                <div className="drop-down-menu">
                    {drop_down_list.map((item, idx) => (
                    <div
                        key={idx}
                        className="drop-down-item"
                        onClick={() => {
                        toggleTimeFrame(item);
                        toggleDropdown(false);
                        }}
                    >
                        {item}
                    </div>
                    ))}
                </div>
                )}
            </div>
            ) : (
            // else return empty div
            <div className="drop-down-menu-container" />
            )}

            <p className="drop-down-label">{activeTimeFrame}</p>
            <input className="drop-down-input" />
        </div>
    )
}