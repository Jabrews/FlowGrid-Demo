import { createContext, useContext } from "react";
import { create } from "zustand";

// dropped items context
import type { DroppedItem } from "../ItemFactory/ItemFactoryContext";

// create local storage item
import { addTimerPair } from "../../Elements/LocalStorage/TimerPairLocalStorage";


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
        addTimerPair(pairObject);
        set((state) => ({
            timerTrackerItems: [...state.timerTrackerItems, pairObject],
        }));
    },
    checkTimerConnected: (timerId: string) => {
      return get().timerTrackerItems.some((pair: TimerPairItem) =>
        pair.item.id === timerId
      );
    },
    checkTrackerConnected: (trackerId: string) => {
      return get().timerTrackerItems.some((pair: TimerPairItem) =>
        pair.tracker.id === trackerId
      );
    },
    findTimerTrackerConnections: (trackerId: string) => {
      return get().timerTrackerItems.filter((item: TimerPairItem) =>
        item.tracker.id === trackerId
      );
    },
    removeTimerTrackerItem: (timerId: string) =>
      set((state) => ({
        timerTrackerItems: state.timerTrackerItems.filter(
          (pair: TimerPairItem) => pair.item.id !== timerId
        ),
      })),
    removeTimerTracker: (trackerId: string) =>
      set((state) => ({
        timerTrackerItems: state.timerTrackerItems.filter(
          (pair: TimerPairItem) => pair.tracker.id !== trackerId
        ),
      })),
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
