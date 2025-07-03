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
  placementPos : {x : number, y : number}
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

  whiteboardGridRef : RefObject<HTMLDivElement | null> | null;
  setWhiteboardGridRef : (ref: RefObject<HTMLDivElement | null>) => void
  
  userAddingItem : boolean,
  toggleUserAddingItem : (toggleStatus : boolean) => void

  itemDroppedMousePos : DroppedMousePos
  setItemDroppedMousePos : (newPos : DroppedMousePos) => void

  calcRelativeMousePos : () => {x: number, y : number} 

  gridMargin: [number, number];
  updateGridMarginFromWindow: () => void;


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

    calcRelativeMousePos: () => {
    const whiteboard = get().whiteboardGridRef?.current;
    const mousePos = get().itemDroppedMousePos;

    if (!whiteboard) return { x: 0, y: 0 };

    const scrollLeft = whiteboard.scrollLeft;
    const scrollTop = whiteboard.scrollTop;

    const offsetX = mousePos.x + scrollLeft - whiteboard.getBoundingClientRect().left;
    const offsetY = mousePos.y + scrollTop - whiteboard.getBoundingClientRect().top;

    // now divide by column size
    const colWidth = 75;
    const rowHeight = 250;
    const marginX = get().gridMargin[0];
    const marginY = get().gridMargin[1];

    const gridX = Math.floor((offsetX + marginX / 2) / (colWidth + marginX));
    const gridY = Math.floor((offsetY + marginY / 2) / (rowHeight + marginY));

return { x: gridX, y: gridY };


    },
    whiteboardGridRef : null,
    setWhiteboardGridRef : (ref) => set({whiteboardGridRef : ref}),
    gridMargin: [100, 150], 

    updateGridMarginFromWindow: () => {
      const isMobile = window.innerWidth < 768;
      const newMargin: [number, number] = isMobile ? [50, 135] : [70, 155];
      set(() => ({ gridMargin: newMargin }));
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
