import type { TimerPairItem } from "../../Context/TrackerMenusContext/TimerMenuContext";

// helper to read all pairs from local storage
function getTimerPairs(): TimerPairItem[] {
  const raw = localStorage.getItem('TimerPairs');
  return raw ? JSON.parse(raw) : [];
}

// helper to write all pairs to local storage
export function saveTimerPairsToLocalStorage(pairs: TimerPairItem[]) {
  localStorage.setItem('TimerPairs', JSON.stringify(pairs));
}

// add a new timer pair
export function addTimerPairToLocalStorage (timerPair: TimerPairItem) {
  try {
    const timerPairList = getTimerPairs();
    timerPairList.push(timerPair);
    saveTimerPairsToLocalStorage(timerPairList);
  } catch (error) {
    console.log('error adding new TimerPair to local:', error);
  }
}

