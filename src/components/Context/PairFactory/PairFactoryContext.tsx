import { createContext, useContext } from "react";
import { create } from "zustand";

import type { DroppedItem } from "../ItemFactory/ItemFactoryContext";
import { useItemFactoryContext } from "../ItemFactory/ItemFactoryContext";

import type { TimerPairItem } from "../TrackerMenusContext/TimerMenuContext";
import { useTimerMenuContext } from "../TrackerMenusContext/TimerMenuContext";


// store factory
const createPairFactoryStore = (
  getDroppedItems: () => DroppedItem[],
  addTimeTrackerItem: (pairObject: TimerPairItem) => void
) =>
  create((set, get) => ({
    connectedItems: [],
    connectedTracker: null,
    connectedItem: null,

    addConnectedTracker: (trackerId: string) =>
      set((state: any) => {
        const droppedItems = getDroppedItems();
        const item = droppedItems.find(
          (item) => item.id === trackerId && item.tracker === true
        );
        return {
          connectedTracker: item || state.connectedTracker,
        };
      }),

    addConnectedItem: (itemId: string) =>
      set((state: any) => {
        const droppedItems = getDroppedItems();
        const item = droppedItems.find(
          (item) => item.id === itemId && item.trackable === true
        );
        return {
          connectedItem: item || state.connectedItem,
        };
      }),

    createPair: () =>
      set((state) => {
        const { connectedItem, connectedTracker, connectedItems } = state;

        if (!connectedItem || !connectedTracker) {
          console.log("Cannot create pair: missing connectedItem or connectedTracker.");
          return state;
        }

        if (connectedItem.connected) {
          const alreadyConnected = connectedItems.some(
            (pair) =>
              pair.tracker.id === connectedTracker.id &&
              pair.item.id === connectedItem.id
          );
          if (alreadyConnected) {
            console.log("tracker already has connection:", connectedTracker.id);
            return state;
          }
        }

        connectedItem.connected = true;
        connectedTracker.connected = true;

        if (connectedItem.type === "Timer") {
          addTimeTrackerItem({
            type: "TimerPair",
            pairId: `TimerPair-${Date.now()}`,
            tracker: connectedTracker,
            item: connectedItem,
            fields: {
              dailyStreak: 0,
              lastTimeUsed: Date.now().toString(),
              elaspedTime : 0
            },
          });
        }

        return {
          ...state,
          connectedItems: [
            ...connectedItems,
            {
              tracker: connectedTracker,
              item: connectedItem,
            },
          ],
        };
      }),

    removeConnectedItem: (itemId: string) =>
      set((state) => ({
        connectedItems: state.connectedItems.filter(
          (pair) => pair.item.id !== itemId
        ),
      })),
  }));

// context
const pairFactoryContext = createContext<ReturnType<typeof createPairFactoryStore> | null>(null);

// provider
export const PairFactoryyProvider = ({ children }: { children: React.ReactNode }) => {
  const itemStore = useItemFactoryContext();
  const timerMenuStore = useTimerMenuContext();

  const getDroppedItems = () => itemStore.getState().droppedItems;
  const addTimeTrackerItem = timerMenuStore.getState().addTimeTrackerItem;

  const store = createPairFactoryStore(getDroppedItems, addTimeTrackerItem);

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
