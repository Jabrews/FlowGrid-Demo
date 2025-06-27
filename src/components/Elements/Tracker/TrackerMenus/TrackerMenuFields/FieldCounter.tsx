import { useEffect, useState, useRef } from 'react';
import { useTimerMenuContext } from '../../../../Context/TrackerMenusContext/TimerMenuContext';


export type FieldCounterProps = {
  is_dropdown: boolean;
  title: string;
  label: string;
  drop_down_list: string[];
  id: string;
  type: string;
  parentTimerId: string;
  parentTrackerId : string;
};

export default function FieldCounter({
  is_dropdown,
  label,
  drop_down_list,
  parentTimerId,
  parentTrackerId,
  type,
  id,
}: FieldCounterProps) {

  // timer menu store
  const timerMenuStore = useTimerMenuContext()
  const getStreakFieldValue = timerMenuStore((state) => state.getStreakFieldValue)
  // trackerId: string, key: string, newValue: number
  const updateTimerFieldData = timerMenuStore((state) => state.updateTimerFieldData)
  const getElaspedTimeFieldValue = timerMenuStore((state) => state.getElaspedTimeFieldValue)

  const [showDropdown, toggleDropdown] = useState(false);
  const [activeTimeFrame, toggleTimeFrame] = useState(label);
  const [initialValue, setInitialValue] = useState<number | undefined>();
  const [inputValue, setInputValue] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isTyping = useRef(false);

  // format ms → "0hr 0min 0sec"
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}hr ${minutes}min ${seconds}sec`;
  };

  // parse "1hr 2min 3sec" → ms
  const parseTime = (str: string): number => {
    const hrMatch = str.match(/(\d+)\s*hr/);
    const minMatch = str.match(/(\d+)\s*min/);
    const secMatch = str.match(/(\d+)\s*sec/);

    const hr = hrMatch ? parseInt(hrMatch[1]) : 0;
    const min = minMatch ? parseInt(minMatch[1]) : 0;
    const sec = secMatch ? parseInt(secMatch[1]) : 0;

    return (hr * 3600 + min * 60 + sec) * 1000;
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (type === 'streak') {
        const number = parseInt(inputValue);
        if (!isNaN(number)) {
          updateTimerFieldData(parentTrackerId, 'dailyStreak', number);
        }
      } else if (type === 'elapsed') {
        const ms = parseTime(inputValue);
        updateTimerFieldData(parentTrackerId, 'elaspedTime', ms);
      }
      isTyping.current = false;
    } catch (error) {
      console.log('error updating input field:', error);
    }
  };

  // refresh display
  useEffect(() => {
    const fetchLatest = () => {
      if (isTyping.current) return;

      if (type === 'streak') {
        const value = getStreakFieldValue(parentTimerId);
        setInitialValue(value);
        setInputValue(String(value));
      } else if (type === 'elapsed') {
        const value = getElaspedTimeFieldValue(parentTimerId);
        setInitialValue(value);
        setInputValue(formatTime(value));
      }
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 1000);
    return () => clearInterval(interval);
  }, [type, parentTimerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isTyping.current = true;
    setInputValue(e.target.value);
  };

  // Reset on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (type === 'streak') {
          setInputValue(String(initialValue ?? ''));
        } else if (type === 'elapsed') {
          setInputValue(formatTime(initialValue ?? 0));
        }
        isTyping.current = false;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [initialValue]);

  return (
    <div className="drop-down-counter-container" ref={wrapperRef} key={id}>
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
        <div className="drop-down-menu-container" />
      )}

      <p className="drop-down-label">{activeTimeFrame}</p>

      <form onSubmit={handleInputSubmit}>
        <input
          className="drop-down-input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={type === 'elapsed' ? '0hr 0min 0sec' : initialValue?.toString() ?? ''}
        />
      </form>
    </div>
  );
}
