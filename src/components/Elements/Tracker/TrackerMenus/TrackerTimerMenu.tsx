import { useState } from 'react';
import FieldCounter from './TrackerMenuFields/FieldCounter';
import type { FieldCounterProps } from './TrackerMenuFields/FieldCounter';

export type TrackerTimerMenuProps = {
  parentTimerId: string;
};

export default function TrackerTimerMenu({ parentTimerId }: TrackerTimerMenuProps) {
  const [showDropdown, toggleDropdown] = useState(false);
  const [fields, setFields] = useState<FieldCounterProps[]>([]);


  console.log('parent timer id : ', parentTimerId)

  const fieldOptions = [
    {
      is_dropdown: false,
      title: 'Elapsed Time',
      label: 'Elasped',
      drop_down_list: [''],
      type: 'elapsed',
    },
    {
      is_dropdown: false,
      title: 'Daily Streak',
      label: 'Streak',
      drop_down_list: [''],
      type: 'streak',
    },
  ];

  return (
    <div className="timer-menu-container">
      {/* Dropdown Menu */}
      <div className="drop-down-menu-container">
        <button className="add-btn" onClick={() => toggleDropdown((prev) => !prev)}>
          +
        </button>

        {showDropdown && (
          <div className="drop-down-menu">
            {fieldOptions.map((item, idx) => (
              <div
                key={idx}
                className="drop-down-item"
                onClick={() => {
                  toggleDropdown(false);
                  setFields((prev) => [
                    ...prev,
                    {
                      is_dropdown: item.is_dropdown,
                      title: item.title,
                      label: item.label,
                      drop_down_list: item.drop_down_list,
                      id: `FieldCounter-${Date.now()}`,
                      type: item.type,
                      parentTimerId: parentTimerId,
                    },
                  ]);
                }}
              >
                {item.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render all FieldCounter items */}
      {fields.map((field, idx) => (
        <div key={idx} className="timer-menu-item">
          <FieldCounter {...field} />
          <button
            className="timer-menu-delete-btn"
            onClick={() => setFields(fields.filter((_, i) => i !== idx))}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
