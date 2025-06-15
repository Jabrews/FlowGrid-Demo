import { createContext, useContext } from "react";
import { create } from "zustand";

import type { DroppedItem } from "../ItemFactory/ItemFactoryContext";

// itemFactory 
import { useItemFactoryContext } from "../ItemFactory/ItemFactoryContext";

// leader line 
import { useConnectionLinesContext } from "../ConnectionLines";

// tracker menus
import { useTimerMenuContext } from "../TrackerMenusContext/TimerMenuContext";
import type {connectedMenuItem} from "../TrackerMenusContext/TimerMenuContext";
import { i, line } from "framer-motion/client";
let droppedItems : DroppedItem[] = [];
let addTimeTrackerItem : (pairObject: connectedMenuItem) => void;
let addConnectionLine : (trackerId : string, itemId : string) => void;

export type PairObject = {
    trackerId: string;
    itemId: string;
    type: string;
    };



// store factory
const createPairFactoryStore = () =>
create((set, get) => ({
  connectedItems: [],
  connectedTracker: null,
  addConnectedTracker: (trackerId: string) =>
    set((state: any) => {
      const item = droppedItems.find(
        (item) => item.id === trackerId && item.tracker === true
      ); // make sure is tracker bool
      return {
        connectedTracker: item ? item : state.connectedTracker,
      };
    }),
  connectedItem: null,
  addConnectedItem: (itemId: string) =>
    set((state: any) => {
      const item = droppedItems.find((item) => item.id === itemId && item.trackable === true); // make sure is trackable bool
      return {
        connectedItem: item ? item : state.connectedItem,
      };
    }),
  createPair: () => set((state) => {
    if (!state.connectedItem || !state.connectedTracker) {
        console.log("Cannot create pair: missing connectedItem or connectedTracker.");
        return state; // no change
    }

    const item = state.connectedItem;
    const tracker = state.connectedTracker;

  if (item.connected === true) {
      const alreadyConnected = state.connectedItems.some((pair) => 
          pair.tracker.id === state.connectedTracker.id && 
          pair.item.id === state.connectedItem.id
      );

      if (alreadyConnected) {
        console.log('tracker already has connection :', state.connectedTracker.id)
          return state;
      }
  }
    

    item.connected = true;
    tracker.connected = true;

    if (item.type === "Timer") {
      addTimeTrackerItem({
        type : 'TimerPair',
        pairId : `TimerPair-${Date.now()}`,
        tracker,
        item,
        fields: {
          increment: 0, 
        }
      })
    }

    addConnectionLine(item.id, tracker.id) 

    return {
        ...state,
        connectedItems: [
            ...state.connectedItems,
            {
                tracker,
                item,
            }
        ]
        };
    }),
   removeConnectedItem : (itemId : string) => set((state) => ({
        connectedItems : state.connectedItems.filter((pair) => pair.item.id !== itemId)
    }))

}));

// context
const pairFactoryContext = createContext(null);

// provider
export const PairFactoryyProvider = ({ children }) => {
    // let context access item factory stuff
    const itemStore = useItemFactoryContext();
    droppedItems = itemStore((state) => state.droppedItems);
    // let context access timer menu stuff
    const timerMenuStore = useTimerMenuContext();
    addTimeTrackerItem = timerMenuStore((state) => state.addTimeTrackerItem);
    // let context acess line connection menu
    const lineConnectionStore = useConnectionLinesContext()
    addConnectionLine = lineConnectionStore((state) => state.addConnectionLine)


    const store = createPairFactoryStore();

  return (
    <pairFactoryContext.Provider value={store}>
      {children}
    </pairFactoryContext.Provider>
  );
};

// hook
export const usePairFactoryContext = () => {
  const store = useContext(pairFactoryContext);
  if (!store) throw new Error("usePairFactoryContext must be used inside PairFactoryyProvider");
  return store;
};
