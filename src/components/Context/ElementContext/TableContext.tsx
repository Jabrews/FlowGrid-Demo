import {nanoid} from 'nanoid';
import { createContext, useContext } from "react";
import { create } from "zustand";

export type TableColumn = {
  parentTableId : string;
  id: string;               
  title: string;            
  width: number;           
  minWidth?: number;        
  maxWidth?: number;        
};

// One row in the table
export type TableRow = {
  parentTableId : string;
  id : string
  title : string 
  cells: Record<string, string>;  // {col1 : 'content, col2' content}
};

export type TableObjectType = {
  parentTableId : string;
  id : string;
  columns : TableColumn[]; 
  row : TableRow[]
}

export type TableType = {
  id : string;
  tableObjects : TableObjectType[];
}

// helper function
const createId = (type : string)=> {
  if (type == 'column') {
    return `col-${nanoid()}`
  }
  if (type == 'row') {
    return `row-${nanoid()}`
  }
}

export const createTableContext = () =>
  create<{
    tables : TableType[]
      }>((set, get) => ({
    tables: [],
  }));

// Context setup
const TableContext = createContext<ReturnType<typeof createTableContext> | null>(null);

export const TableContextProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createTableContext();
  return <TableContext.Provider value={store}>{children}</TableContext.Provider>;
};

export const  useTableContext = () => {
  const store = useContext(TableContext);
  if (!store) {
    throw new Error("useTableContext must be used inside TableContextProvider");
  }
  return store;
};
