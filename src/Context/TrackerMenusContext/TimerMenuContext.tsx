import { createContext, useContext } from "react";
import { create } from "zustand";

// dropped items context
import type { DroppedItem } from "../ItemFactory/ItemFactoryContext";

// create local storage item
import {addTimerPairToLocalStorage, saveTimerPairsToLocalStorage} from "../../components/Elements/LocalStorage/TimerPairLocalStorage";



export type TimerPairItem = {
  type: string;
  pairId: string;
  item: DroppedItem;
  tracker: DroppedItem;
  fields: {
    dailyStreak: number;
    lastTimeUsed: string;
    elaspedTime : number
  };
};


// store factory
const TimerMenuStore = () =>
  create((set, get) => ({
    timerTrackerItems: [],
    addTimeTrackerItem: (pairObject: TimerPairItem) => {
      addTimerPairToLocalStorage(pairObject);
      set((state) => ({
        timerTrackerItems: [...state.timerTrackerItems, pairObject],
      }));
    },
    findTimerTrackerConnections: (trackerId: string) => {
      return get().timerTrackerItems.filter((item: TimerPairItem) =>
        item.tracker.id === trackerId
      );
    },
    removeTimerPairByItemId: (itemId: string) => {
      set((state) => ({
        timerTrackerItems: state.timerTrackerItems.filter(
          (pair: TimerPairItem) =>
            pair.item.id !== itemId && pair.tracker.id !== itemId
        ),
      }));

      const updatedItems = get().timerTrackerItems;
      saveTimerPairsToLocalStorage(updatedItems);
    },
    updateTimerFieldData: (trackerId: string, key: string, newValue: number) => {
      set((state) => ({
        timerTrackerItems: state.timerTrackerItems.map((pair: TimerPairItem) => {
          if (pair.tracker.id === trackerId) {
            return {
              ...pair,
              fields: {
                ...pair.fields,
                [key]: newValue,
              },
            };
          }
          return pair;
        }),
      }));
      // save updated state to localStorage
      const updatedItems = get().timerTrackerItems;
      saveTimerPairsToLocalStorage(updatedItems);
    }, 
    getLastTimeUsed: (timerId: string) => {
      try {
        const match = get().timerTrackerItems.find((item) => item.item.id === timerId);
        return match?.fields.lastTimeUsed ?? null;
      } catch (error) {
        console.error('Error in getLastTimeUsed:', error);
        return null;
      }
    },
    getStreakFieldValue: (timerId : string) => {
      try {
        const match = get().timerTrackerItems.find((item) => item.item.id === timerId);
        return match?.fields.dailyStreak?? null;
      } catch (error) {
        console.error('Error in getLastTimeUsed:', error);
        return null;
      }
    },
    getElaspedTimeFieldValue : (timerId : string) => {
      try {
        const match = get().timerTrackerItems.find((item) => item.item.id === timerId);
        return match?.fields.elaspedTime?? null;
      } catch (error) {
        console.error('Error in getLastTimeUsed:', error);
        return null;
      }
    },
    addToElaspedTimeFieldValue : (timerId : string, timeAdded : number) => {
      try {
        const match = get().timerTrackerItems.find((item) => item.item.id === timerId);
        match.fields.elaspedTime += timeAdded
        const updatedItems = get().timerTrackerItems;
        saveTimerPairsToLocalStorage(updatedItems);
      } 
      catch (error) {
        console.log('error adding to elasped time field, likely just not connected yet : ', error)
      }
            },
    handleTimerStreakField: (lastTimeUsed: string, timerId: string) => {
      const oneDay = 1000 * 60 * 60 * 24;
      const current = Math.floor(Date.now() / oneDay);
      const previous = Math.floor(Number(lastTimeUsed) / oneDay);
      const dayDifference = current - previous;

      if (dayDifference === 0) {
        console.log('same day');
        return;
      } else if (dayDifference === 1) {
        get().updateStreak(timerId, 'increment');
      } else if (dayDifference >= 2) {
        get().updateStreak(timerId, 'reset');
      }
    },
    updateStreak: (timerId: string, streakStatus: 'increment' | 'reset') => {
      set((state) => ({
        timerTrackerItems: state.timerTrackerItems.map((pair: TimerPairItem) => {
          if (pair.item.id === timerId) {
            const newStreak = streakStatus === 'increment'
              ? (pair.fields.dailyStreak || 0) + 1
              : 0;

            return {
              ...pair,
              fields: {
                ...pair.fields,
                dailyStreak: newStreak,
                lastTimeUsed: Date.now().toString(),
              },
            };
          }
          return pair;
        }),
      }));

      // save updated state to localStorage
      const updatedItems = get().timerTrackerItems;
      saveTimerPairsToLocalStorage(updatedItems);
    }, 

    

  }));



// context
const TimerMenuContext = createContext(null);

// provider
export const TimerMenuContextProvider = ({ children }) => {
  const store = TimerMenuStore();

  return (
    <TimerMenuContext.Provider value={store}>
      {children}
    </TimerMenuContext.Provider>
  );
};

// hook
export const useTimerMenuContext = () => {
  const store = useContext(TimerMenuContext);
  if (!store) throw new Error("useTimerMenuContext must be used inside TimerMenuContextProvider");
  return store;
};
