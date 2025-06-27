import { useTimer } from 'react-timer-hook';
import { useState, useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';

import { useTimeoutModal } from '../TimeoutModel/TimeoutModelContext';
import { useTimerMenuContext}from '../../Context/TrackerMenusContext/TimerMenuContext';

type TimerProps = {
  id: string;
};

export default function Timer({ id }: TimerProps) {
  const { openModal } = useTimeoutModal();

  const startingTime = new Date();
  startingTime.setSeconds(startingTime.getSeconds() + 5);

  const [maxTime, setMaxTime] = useState(0);
  const [Timer, setTimer] = useState(startingTime);
  const [userMin, setUserMin] = useState(1);
  const [userHours, setUserHours] = useState(0);
  const [userSec, setUserSec] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const elapsedRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [displayEndModal, toggleDisplayEndModal] = useState(true)


  // timer menu store
  const timerMenuStore = useTimerMenuContext()
  const getLastTimeUsed = timerMenuStore((state) => state.getLastTimeUsed)
  const handleTimerStreakField = timerMenuStore((state) => state.handleTimerStreakField)
  const addToElaspedTimeFieldValue = timerMenuStore((state) => state.addToElaspedTimeFieldValue)  


  const {
    seconds,
    minutes,
    hours,
    pause,
    resume,
    restart,
    isRunning,
  } = useTimer({
    expiryTimestamp: Timer,
    onExpire: () => {
      handleDisplayModal()
      addToElaspedTimeFieldValue(id, elapsedRef.current);
      elapsedRef.current = 0;
      setElapsedTime(0);
    },
  });

  // bit hacky
  const handleDisplayModal = () => {
      if (displayEndModal) {
        openModal();
        toggleDisplayEndModal(false)
      }
  }

  useEffect(() => {
    const lastUsed = getLastTimeUsed(id);
    if (lastUsed) {
      handleTimerStreakField(lastUsed, id);
    }
  }, [id]);

  function handleTimerSubmit(e: React.FormEvent) {
    e.preventDefault();
    toggleDisplayEndModal(true)

    const totalSeconds = userHours * 3600 + userMin * 60 + userSec;
    const future = new Date();
    future.setSeconds(future.getSeconds() + totalSeconds);

    setIsPaused(false);
    setMaxTime(totalSeconds);
    setTimer(future);
    restart(future);

    elapsedRef.current = 0;
    setElapsedTime(0);
  }

  function resetTimer() {
    toggleDisplayEndModal(true)
    const future = new Date();
    future.setSeconds(future.getSeconds() + maxTime);
    setTimer(future);
    restart(future);
    addToElaspedTimeFieldValue(id, elapsedRef.current);
    elapsedRef.current = 0;
    setElapsedTime(0);
    setIsPaused(false);
  }

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      elapsedRef.current += 1000;
      setElapsedTime(elapsedRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const handlePause = () => {
    pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    resume();
    setIsPaused(false);
  };

  const remaining = hours * 3600 + minutes * 60 + seconds;
  const progress = maxTime > 0 ? ((maxTime - remaining) / maxTime) * 100 : 0;

  return (
    <div className="timer-container">
      <form onSubmit={handleTimerSubmit} className="set-timer-container">
        <label>Hours</label>
        <input
          type="number"
          value={userHours}
          onChange={(e) => setUserHours(Number(e.target.value))}
        />
        <label>Minutes</label>
        <input
          type="number"
          value={userMin}
          onChange={(e) => setUserMin(Number(e.target.value))}
        />
        <label>Seconds</label>
        <input
          type="number"
          value={userSec}
          onChange={(e) => setUserSec(Number(e.target.value))}
        />
        <button type="submit">Set Timer</button>
      </form>

      <div className="progress-container">
        <p>
          Time Remaining: {hours}:{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
        <ProgressBar progress={progress} />
      </div>

      <div className="button-container">
        <button onClick={resetTimer}>Restart</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleResume}>Resume</button>
      </div>
    </div>
  );
}
