import { createContext, useContext } from "react";
import { create } from "zustand";
import type { RefObject } from "react";

// dropped item types
export type DroppedItem = {
  id: string;
  type: string;
  trackable: boolean;
  tracker: boolean;
  connected: boolean;
};

export type DroppedItemRect = {
  bottom: number;
  left: number;
  right: number;
  top: number;
  height: number;
  width: number;
};

export type DroppedMousePos = {x : number,  y : number}

export type IOBundleItem = {
  portType: string;
  portId: string;
  parentConnection: string;
};

type ItemFactoryStore = {
  droppedItems: DroppedItem[];
  IOBundle: IOBundleItem[];

  addDroppedItem: (newItem: DroppedItem) => void;
  removeDroppedItem: (id: string) => void;

  whiteboardRef: RefObject<HTMLDivElement | null> | null;
  setWhiteboardRef: (ref: RefObject<HTMLDivElement | null>) => void;
  
  userAddingItem : boolean,
  toggleUserAddingItem : (toggleStatus : boolean) => void

  itemDroppedMousePos : DroppedMousePos
  setItemDroppedMousePos : (newPos : DroppedMousePos) => void

  relativeMousePos :  {x : number, y : number} | null
  calcRelativeMousePos : () => void

};

const createItemFactoryStore = () =>
  create<ItemFactoryStore>((set, get) => ({
    droppedItems: [],
    IOBundle: [],

    addDroppedItem: (newItem) =>
      set((state) => ({
        droppedItems: [...state.droppedItems, newItem],
      })),

    removeDroppedItem: (id) =>
      set((state) => ({
        droppedItems: state.droppedItems.filter((item) => item.id !== id),
      })),

    whiteboardRef: null,
    setWhiteboardRef: (ref) => set({ whiteboardRef: ref }),

    userAddingItem : false,
    toggleUserAddingItem: (value: boolean) =>
      set(() => ({ userAddingItem: value })),

    itemDroppedMousePos: { x: 0, y: 0 }, // placeholder
    setItemDroppedMousePos: (newPos: DroppedMousePos) =>
      set(() => ({ itemDroppedMousePos: newPos })),

    relativeMousePos: null,
    calcRelativeMousePos: () => {
      const whiteboardRef = get().whiteboardRef;
      const mousePos = get().itemDroppedMousePos;
      const whiteboardRect = whiteboardRef?.current?.getBoundingClientRect();

      if (!whiteboardRect) {
        set(() => ({ relativeMousePos: null }));
        return; 
      }

      const relativeX = mousePos.x - whiteboardRect.left;
      const relativeY = mousePos.y - whiteboardRect.top;

      set(() => ({
        relativeMousePos: { x: relativeX, y: relativeY },
      }));
    },


  }));

// context
const ItemFactoryContext = createContext<ReturnType<typeof createItemFactoryStore> | null>(null);

// provider
export const ItemFactoryProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createItemFactoryStore();
  return (
    <ItemFactoryContext.Provider value={store}>
      {children}
    </ItemFactoryContext.Provider>
  );
};

// hook
export const useItemFactoryContext = () => {
  const store = useContext(ItemFactoryContext);
  if (!store) throw new Error("useItemFactoryContext must be used inside ItemFactoryProvider");
  return store;
};
