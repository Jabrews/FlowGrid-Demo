import { createContext, useContext } from "react";
import { create } from "zustand";

// for disconnecting pairs
import type { ConnectedPair } from "../PairFactory/PairFactoryContext";
import { usePairFactoryContext } from "../PairFactory/PairFactoryContext";
import { useTimerMenuContext } from "../TrackerMenusContext/TimerMenuContext";
import { useConnectionLinesContext } from "../ConnectionLines/ConnectionLines";

export type ToggleObject = {
  toggleId: string;
  itemId: string;
  trackerId: string;
  checked: boolean;
  trackerConnections : number;
};

export const createConnectionToggleModalStore = (
  removeConnectedItem: (itemId: string) => void,
  removeTimerPairByItemId: (itemId: string) => void,
  getTotalTrackerConnections : (trackerId : string) => number,
  removeLineElem : (itemId : string) => void,
) =>
  create<{
    showModal: boolean;
    toggleObjects: ToggleObject[];
    toggleShowModal: (status: boolean) => void;
    parentItemId : string;
    setParentItemId : (newParentItemId : string) => void
    clearToggleObjects: () => void;
    updateToggleObjects: (connectedItems: ConnectedPair[], itemId: string) => void;
    toggleChecked: (toggleId: string) => void;
    disconnectItems: () => void;
  }>((set, get) => ({
    showModal: false,

    toggleObjects: [],

    toggleShowModal: (status: boolean) => {
      try {
        set(() => ({
          showModal: status,
        }));
      } catch (error) {
        console.log("Error occurred toggling ConnectionToggleModal:", error);
      }
    },

    parentItemId : '',

    setParentItemId : (newParentItemId : string) => set(() => ({
      parentItemId: newParentItemId
    })),

    clearToggleObjects: () => {
      set(() => ({ toggleObjects: [] }));
    },

    updateToggleObjects: (connectedItems: ConnectedPair[], itemId: string) => {
      const pairObjects = connectedItems.filter((item) => item.item.id === itemId);
      const newToggleObjects = pairObjects.map((item) => ({
        toggleId: `toggle-${item.tracker.id}`,
        itemId: item.item.id,
        trackerId: item.tracker.id,
        checked: false,
        trackerConnections : getTotalTrackerConnections(item.tracker.id),
      }));
      set(() => ({ toggleObjects: newToggleObjects }));
    },

    toggleChecked: (toggleId: string) =>
      set((state) => ({
        toggleObjects: state.toggleObjects.map((object: ToggleObject) =>
          object.toggleId === toggleId
            ? { ...object, checked: !object.checked }
            : object
        ),
      })),

    disconnectItems: () => {
      const checkedItems = get().toggleObjects.filter((object) => object.checked === true);
      checkedItems.forEach((item) => {
        console.log("DEBUG: removing connection for", item.itemId);
        removeConnectedItem(item.itemId);
        removeTimerPairByItemId(item.itemId);
        removeLineElem(item.itemId)
      });
    },
  }));

// context
const ConnectionToggleModalContext = createContext<ReturnType<typeof createConnectionToggleModalStore> | null>(null);

// provider
export const ConnectionToggleModalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const pairStore = usePairFactoryContext();
  const timerStore = useTimerMenuContext();
  const lineStore = useConnectionLinesContext();

  const removeConnectedItem = pairStore.getState().removeConnectedItem;
  const removeTimerPairByItemId = timerStore.getState().removeTimerPairByItemId;
  const getTotalTrackerConnections = pairStore.getState().getTotalTrackerConnections;
  const removeLineElem = lineStore.getState().removeLineElem;

  const store = createConnectionToggleModalStore(removeConnectedItem, removeTimerPairByItemId, getTotalTrackerConnections, removeLineElem);

  return (
    <ConnectionToggleModalContext.Provider value={store}>
      {children}
    </ConnectionToggleModalContext.Provider>
  );
};

// hook
export const useConnectionToggleModalStore = () => {
  const store = useContext(ConnectionToggleModalContext);
  if (!store)
    throw new Error(
      "useConnectionToggleModalStore must be used inside ConnectionToggleModalContextProvider"
    );
  return store;
};
