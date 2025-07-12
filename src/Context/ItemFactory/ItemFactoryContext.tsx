import { createContext, useContext, useRef } from "react";
import { create } from "zustand";
import type { RefObject } from "react";

// types
export type DroppedItem = {
  id: string;
  type: string;
  trackable: boolean;
  tracker: boolean;
  connected: boolean;
  placementPos: { x: number; y: number };
};

export type DroppedMousePos = { x: number; y: number };

export type IOBundleItem = {
  portType: string;
  portId: string;
  parentConnection: string;
};

type ItemFactoryStore = {
  droppedItems: Record<string, DroppedItem>;
  IOBundle: IOBundleItem[];

  addDroppedItem: (item: DroppedItem) => void;
  removeDroppedItem: (id: string) => void;
  updateDroppedItemPosition: (id: string, pos: { x: number; y: number }) => void;

  whiteboardRef: RefObject<HTMLDivElement | null> | null;
  setWhiteboardRef: (ref: RefObject<HTMLDivElement | null>) => void;

  whiteboardGridRef: RefObject<HTMLDivElement | null> | null;
  setWhiteboardGridRef: (ref: RefObject<HTMLDivElement | null>) => void;

  userAddingItem: boolean;
  toggleUserAddingItem: (v: boolean) => void;

  itemDroppedMousePos: DroppedMousePos;
  setItemDroppedMousePos: (pos: DroppedMousePos) => void;

  calcRelativeMousePos: () => { x: number; y: number };

  gridMargin: [number, number];
  updateGridMarginFromWindow: () => void;
};

// --- zustand store factory
const createItemFactoryStore = () =>
  create<ItemFactoryStore>((set, get) => {
    const saved = localStorage.getItem("droppedItems");
    const initialItems = saved ? JSON.parse(saved) : {};

    const store: ItemFactoryStore = {
      droppedItems: initialItems,
      IOBundle: [],

      addDroppedItem: (item) =>
        set((state) => {
          const updated = {
            ...state.droppedItems,
            [item.id]: item,
          };
          localStorage.setItem("droppedItems", JSON.stringify(updated));
          return { droppedItems: updated };
        }),

      removeDroppedItem: (id) =>
        set((state) => {
          const updated = { ...state.droppedItems };
          delete updated[id];
          localStorage.setItem("droppedItems", JSON.stringify(updated));
          return { droppedItems: updated };
        }),

      updateDroppedItemPosition: (id, pos) =>
        set((state) => {
          const item = state.droppedItems[id];
          if (!item) return {};
          const updated = {
            ...state.droppedItems,
            [id]: { ...item, placementPos: pos },
          };
          localStorage.setItem("droppedItems", JSON.stringify(updated));
          return { droppedItems: updated };
        }),

      whiteboardRef: null,
      setWhiteboardRef: (ref) => set({ whiteboardRef: ref }),

      whiteboardGridRef: null,
      setWhiteboardGridRef: (ref) => set({ whiteboardGridRef: ref }),

      userAddingItem: false,
      toggleUserAddingItem: (v) => set({ userAddingItem: v }),

      itemDroppedMousePos: { x: 0, y: 0 },
      setItemDroppedMousePos: (pos) => set({ itemDroppedMousePos: pos }),

      calcRelativeMousePos: () => {
        const whiteboard = get().whiteboardGridRef?.current;
        const mousePos = get().itemDroppedMousePos;

        if (!whiteboard) return { x: 0, y: 0 };

        const rect = whiteboard.getBoundingClientRect();
        const scrollLeft = whiteboard.scrollLeft;
        const scrollTop = whiteboard.scrollTop;
        // const zoom = window.devicePixelRatio || 1;

        const offsetX = (mousePos.x - rect.left + scrollLeft) ; // /zoom
        const offsetY = (mousePos.y - rect.top + scrollTop) ;

        const colWidth = 125;
        const rowHeight = 5;
        const [marginX, marginY] = get().gridMargin;

        const gridX = Math.floor((offsetX + marginX / 2) / (colWidth + marginX));
        const gridY = Math.floor((offsetY + marginY / 2) / (rowHeight + marginY));

        return { x: gridX, y: gridY };

    },


      gridMargin: [100, 150],
      updateGridMarginFromWindow: () => {
        const isMobile = window.innerWidth < 768;
        const newMargin: [number, number] = isMobile ? [50, 135] : [70, 155];
        set({ gridMargin: newMargin });
      },
    };

    return store;
  });

// --- context setup
const ItemFactoryContext = createContext<ReturnType<typeof createItemFactoryStore> | null>(null);

export const ItemFactoryProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<ReturnType<typeof createItemFactoryStore>>();
  if (!storeRef.current) {
    storeRef.current = createItemFactoryStore();
  }

  return (
    <ItemFactoryContext.Provider value={storeRef.current}>
      {children}
    </ItemFactoryContext.Provider>
  );
};

export const useItemFactoryContext = () => {
  const store = useContext(ItemFactoryContext);
  if (!store) throw new Error("useItemFactoryContext must be used inside ItemFactoryProvider");
  return store;
};
