import { createContext, useContext } from "react";
import { create } from "zustand";
import type { PairObject } from "../../Context/PairFactory/PairFactoryContext";


// variables holding value of respected 'delete item' function
export type DroppedItem = {
  id: string;
  type: string;
  trackable : boolean;
  tracker : boolean;
  connected : boolean;
  pairObject : PairObject; // make 
}


export type IOBundleItem = {
  portType : string;
  portId : string;
  parentConnection : string;
}

// store factory
const createItemFactoryStore = () =>
  create((set) => ({
    droppedItems : [],
    IOBundle : [],
    addDroppedItem : (newItem : DroppedItem) => set((state) => ({
        droppedItems: [...state.droppedItems, newItem]
    })),
    removeDroppedItem: (id: string) =>
    set((state) => ({
      droppedItems: state.droppedItems.filter(item => item.id !== id),
          }),
      ),
    

    }));

// context
const ItemFactoryContext = createContext(null);

// provider
export const ItemFactoryProvider = ({ children }) => {
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
