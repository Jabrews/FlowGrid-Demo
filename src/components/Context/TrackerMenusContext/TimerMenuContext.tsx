
import { createContext, useContext } from "react";
import { create } from "zustand";

// dropped items context
import type { DroppedItem } from "../ItemFactory/ItemFactoryContext";
import { time } from "framer-motion";

export type connectedMenuItem = {
  type : string;
  pairId: string;
  item: DroppedItem ;
  tracker: DroppedItem;
  fields : {
    increment: number;
  }
};


// store factory
const TimerMenuStore = () =>
    create((set, get) => ({
        timerTrackerItems: [],
        addTimeTrackerItem: (pairObject: connectedMenuItem) =>
            set((state) => ({
                timerTrackerItems: [...state.timerTrackerItems, pairObject],
            })),
        checkTimerConnected: (timerId: string) => {
            return get().timerTrackerItems.some((pair: connectedMenuItem) =>
                pair.item.id === timerId
            );
        },
        checkTrackerConnected: (trackerId: string) => {
            return get().timerTrackerItems.some((pair: connectedMenuItem) =>
                pair.tracker.id === trackerId
            );
        },
        incrementTimer: (timerId: string) =>
            set((state) => ({
                timerTrackerItems: state.timerTrackerItems.map((pair: TimerPairObject) => {
                    if (pair.item.id === timerId) {
                        return {
                            ...pair,
                            fields: {
                                ...pair.fields,
                                increment: pair.fields.increment + 1,
                            },
                        };
                    }
                    return pair;
                }),
            })),
        findTimerTrackerConnections : (trackerId : string) => {
            return get().timerTrackerItems.filter((item) => 
                item.tracker.id === trackerId 
            )
        },
       removeTimerTrackerItem : (timerId: string) => set((state) => ({
        timerTrackerItems : state.timerTrackerItems.filter((pair : connectedMenuItem) => pair.item.id !==  timerId)
       })),
       removeTimerTracker : (trackerId : string) => set((state) => ({
        timerTrackerItems : state.timerTrackerItems.filter((pair : connectedMenuItem) => pair.tracker.id !==  trackerId)
       }))
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
