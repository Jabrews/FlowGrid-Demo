import { useTimer } from 'react-timer-hook';
import { useState } from 'react';
import ProgressBar from './ProgressBar';
// Timeout model context
import { useTimeoutModal } from '../CenterModel/CenterModelContext';

export default function Timer() {
  const startingTime = new Date();
  startingTime.setSeconds(startingTime.getSeconds() + 5); // Default timer duration

  const [maxTime, setMaxTime] = useState(0); // Maximum time in seconds
  const [Timer, setTimer] = useState(startingTime);
  const [userMin, setUserMin] = useState(1); // User input for minutes
  const [userHours, setUserHours] = useState(0); // User input for hours
  const [userSec, setUserSec] = useState(0); // User input for seconds
  // Timeout Model
  const { openModal } = useTimeoutModal(); // Access the modal context



  // Timer Settings
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: Timer,
    onExpire: () => {
      console.log('Timer expired!');
      // showcase modal
      openModal()
    },
  });

  // Handle form submission to set the timer
  function handleTimerSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Calculate the total time in seconds
    const totalSeconds = userHours * 3600 + userMin * 60 + userSec;

    // Create a new Date object for the future time
    const futureTime = new Date();
    futureTime.setSeconds(futureTime.getSeconds() + totalSeconds);

    // Update the Timer state and maxTime
    setTimer(futureTime);
    setMaxTime(totalSeconds);

    // Restart the timer with the new expiry time
    restart(futureTime);
    console.log('Timer reset to:', futureTime);

    setTimerEnd(false); // Reset timer end state
  }

  // reset timer to maxTime
  function resetTimer() {
    const futureTime = new Date();
    futureTime.setSeconds(futureTime.getSeconds() + maxTime);
    setTimer(futureTime);
    restart(futureTime);
    setTimerEnd(false); // Reset timer end state
  }

  // Calculate the remaining time in seconds
  const remainingTime = hours * 3600 + minutes * 60 + seconds;

  // Calculate the progress percentage
  const progress = maxTime > 0 ? ((maxTime - remainingTime) / maxTime) * 100 : 0;

  return (
    <>

      {/*  Timer Elemet */}
      <div className="timer-container">
        <form onSubmit={handleTimerSubmit} className='set-timer-container'>
          {/* Hours input */}
          <label htmlFor="hours">Hours</label>
          <input
            id="hours"
            type="number"
            placeholder="Type Hours"
            value={userHours.toString()}
            onChange={(e) => setUserHours(Number(e.target.value))}
          />

          {/* Minutes input */}
          <label htmlFor="minutes">Minutes</label>
          <input
            id="minutes"
            type="number"
            placeholder="Type Minutes"
            value={userMin.toString()}
            onChange={(e) => setUserMin(Number(e.target.value))}
          />

          {/* Seconds Timer */}
          <label htmlFor="seconds">Seconds</label>
          <input
            id="seconds"
            type="number"
            placeholder="Type Seconds"
            value={userSec.toString()}
            onChange={(e) => setUserSec(Number(e.target.value))}
          />

          {/* Submit button */}
          <button type="submit">Set Timer</button>
        </form>

        <div className='progress-container'>
        {/* Display time remaining */}
          <p>
            Time Remaining: {hours}:{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>

          {/* Progress bar */}
          <ProgressBar progress={progress} />
        </div>


        {/* Timer controls */}
        <div className='button-container'>
          <button onClick={resetTimer}>Restart</button>
          <button onClick={pause}>Pause</button>
          <button onClick={resume}>Resume</button>
          </div>
      </div>    

    </>

  );
}