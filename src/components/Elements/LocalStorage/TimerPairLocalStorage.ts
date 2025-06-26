import type { TimerPairItem } from "../../Context/TrackerMenusContext/TimerMenuContext";

// helper to read all pairs from local storage
function getTimerPairs(): TimerPairItem[] {
  const raw = localStorage.getItem('TimerPairs');
  return raw ? JSON.parse(raw) : [];
}

// helper to write all pairs to local storage
function saveTimerPairs(pairs: TimerPairItem[]) {
  localStorage.setItem('TimerPairs', JSON.stringify(pairs));
}

// add a new timer pair
export function addTimerPair(timerPair: TimerPairItem) {
  try {
    const timerPairList = getTimerPairs();
    timerPairList.push(timerPair);
    saveTimerPairs(timerPairList);
  } catch (error) {
    console.log('error adding new TimerPair to local:', error);
  }
}

// get last time used
export function getLastTimeUsed(timerId: string): string | null {
  const timerPairList = getTimerPairs();
  const match = timerPairList.find((pair) => pair.item.id === timerId);
  if (!match) {
    console.warn('Timer not found for ID:', timerId);
    return null;
  }
  return match.fields.lastTimeUsed;
}

// auto-handle streaks
export function handleTimerStreakField(lastTimeUsed: string, timerId: string) {
  const oneDay = 1000 * 60 * 60 * 24;
  const current = Math.floor(Date.now() / oneDay);
  const previous = Math.floor(Number(lastTimeUsed) / oneDay);
  const dayDifference = current - previous;

  if (dayDifference === 0) {
    console.log('same day');
    return;
  } else if (dayDifference === 1) {
    updateStreak(timerId, 'increment');
  } else if (dayDifference >= 2) {
    updateStreak(timerId, 'reset');
  }
}

// streak updater
function updateStreak(timerId: string, streakStatus: string) {
  const timerPairList = getTimerPairs();
  const currentPair = timerPairList.find(pair => pair.item.id === timerId);

  if (!currentPair) {
    console.warn('Timer not found for ID:', timerId);
    return;
  }

  if (streakStatus === 'reset') {
    currentPair.fields.dailyStreak = 0;
  }

  if (streakStatus === 'increment') {
    currentPair.fields.dailyStreak = (currentPair.fields.dailyStreak || 0) + 1;
  }

  currentPair.fields.lastTimeUsed = Date.now().toString();
  saveTimerPairs(timerPairList);
}

// get streak value
export function getStreakFieldValue(timerId: string): number | undefined {
  const timerPairList = getTimerPairs();
  const currentPair = timerPairList.find(pair => pair.item.id === timerId);
  if (!currentPair) {
    console.warn('Could not find tracker for streak value.');
    return;
  }
  return currentPair.fields.dailyStreak;
}

// update streak manually
export function updateStreakFieldValue(timerId: string, newStreakValue: number) {
  console.log('local storage parent id : ', timerId)
  const timerPairList = getTimerPairs();
  const currentPair = timerPairList.find(pair => pair.item.id === timerId);
  if (currentPair) {
    currentPair.fields.dailyStreak = newStreakValue;
    currentPair.fields.lastTimeUsed = Date.now().toString();
    saveTimerPairs(timerPairList);
  } else {
    console.error('Could not find valid timer for updating streak field');
  }
}

// get elapsed time value
export function getElapsedTimeFieldValue(timerId: string): number | undefined {
  const timerPairList = getTimerPairs();
  const currentPair = timerPairList.find(pair => pair.item.id === timerId);
  if (currentPair) {
    return currentPair.fields.elaspedTime;
  } else {
    console.error('Could not find valid timer for reading elapsed time field');
  }
}

// update elapsed time manually
export function updateElapsedTimeFieldValue(timerId: string, newElapsedTimeValue: number) {
  const timerPairList = getTimerPairs();
  const currentPair = timerPairList.find(pair => pair.item.id === timerId);
  if (currentPair) {
    currentPair.fields.elaspedTime = newElapsedTimeValue;
    saveTimerPairs(timerPairList);
  } else {
    console.error('Could not find valid timer for updating elapsed time field');
  }
}


export function addToElapsedTimeFieldValue(timerId : string, timeAdded : number) {
  const timerPairList = getTimerPairs()
  const currentPair = timerPairList.find((item) => item.item.id == timerId)
  if (!currentPair) {
    return Error('Couldnt find currentPair for addingTimerElaspedTimeField')
  } else {
    currentPair.fields.elaspedTime += timeAdded 
    saveTimerPairs(timerPairList)
  }
}