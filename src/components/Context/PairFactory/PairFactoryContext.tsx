import { createContext, useContext } from "react";
import { create } from "zustand";

import type { DroppedItem } from "../ItemFactory/ItemFactoryContext";
import { useItemFactoryContext } from "../ItemFactory/ItemFactoryContext";

import type { TimerPairItem } from "../TrackerMenusContext/TimerMenuContext";
import { useTimerMenuContext } from "../TrackerMenusContext/TimerMenuContext";


export type ConnectedPair = {
  tracker: DroppedItem;
  item: DroppedItem;
};


// store factory
const createPairFactoryStore = (
  getDroppedItems: () => DroppedItem[],
  addTimeTrackerItem: (pairObject: TimerPairItem) => void
) =>
  create<{
    connectedItems: ConnectedPair[];
    connectedTracker: DroppedItem | null;
    connectedItem: DroppedItem | null;
    addConnectedTracker: (trackerId: string) => void;
    addConnectedItem: (itemId: string) => void;
    createPair: () => void;
    removeConnectedItem: (itemId: string) => void;
    getTotalTrackerConnections: (trackerId: string) => number;

  }>((set, get) => ({
    connectedItems: [],
    connectedTracker: null,
    connectedItem: null,

    addConnectedTracker: (trackerId: string) => {
      const droppedItems = getDroppedItems();
      const item = droppedItems.find(
        (item) => item.id === trackerId && item.tracker === true
      );
      set((state) => ({
        connectedTracker: item || state.connectedTracker,
      }));
    },

    addConnectedItem: (itemId: string) => {
      const droppedItems = getDroppedItems();
      const item = droppedItems.find(
        (item) => item.id === itemId && item.trackable === true
      );
      set((state) => ({
        connectedItem: item || state.connectedItem,
      }));
    },

    createPair: () => {
      const { connectedItem, connectedTracker, connectedItems } = get();

      if (!connectedItem || !connectedTracker) {
        console.log("Cannot create pair: missing connectedItem or connectedTracker.");
        return;
      }

      if (connectedItem.connected) {
        const alreadyConnected = connectedItems.some(
          (pair) =>
            pair.tracker.id === connectedTracker.id &&
            pair.item.id === connectedItem.id
        );
        if (alreadyConnected) {
          console.log("tracker already has connection:", connectedTracker.id);
          return;
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
            elaspedTime: 0,
          },
        });
      }

      set((state) => ({
        connectedItems: [
          ...state.connectedItems,
          {
            tracker: connectedTracker,
            item: connectedItem,
          },
        ],
      }));
    },

    removeConnectedItem: (itemId: string) => {
      set((state) => ({
        connectedItems: state.connectedItems.filter(
          (pair) => pair.item.id !== itemId
        ),
      }));
    },

    getTotalTrackerConnections: (trackerId: string) => {
      const totalConnections = get().connectedItems.filter(
        (item) => item.tracker.id === trackerId
      ).length;
      return totalConnections;
    },

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
