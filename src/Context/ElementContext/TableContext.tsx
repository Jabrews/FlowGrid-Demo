import { nanoid } from 'nanoid';
import { createContext, useContext } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TableColumn = {
  parentTableId: string;
  id: string;
  title: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
};

export type TableRow = {
  parentTableId: string;
  id: string;
  title: string;
  cells: Record<string, string>;
};

export type TableObjectType = {
  title: string;
  parentTableId: string;
  id: string;
  columns: TableColumn[];
  row: TableRow[];
};

export type TableType = {
  id: string;
  tableObjects: TableObjectType[];
};

export const createTableContext = () =>
  create(
    persist(
      (set, get) => ({
        tables: [],

        createTable: (tableId) => {
          const col1Id = 'col1';
          const row1Id = 'row1';

          const newTableObject: TableObjectType = {
            title: 'Untitled Table',
            parentTableId: tableId,
            id: `tableObj-${nanoid()}`,
            columns: [
              {
                id: col1Id,
                parentTableId: tableId,
                title: 'Title 1',
                width: 200,
              },
            ],
            row: [
              {
                id: row1Id,
                parentTableId: tableId,
                title: 'Row 1',
                cells: {
                  [col1Id]: 'sample',
                },
              },
            ],
          };

          set(() => ({
            tables: [
              ...get().tables,
              {
                id: tableId,
                tableObjects: [newTableObject],
              },
            ],
          }));
        },

        getTableObjects: (tableListId) => {
          const table = get().tables.find((t) => t.id === tableListId);
          return table ? table.tableObjects : null;
        },

        createNewTableObject: (tableListId) => {
          const col1Id = 'col1';
          const row1Id = 'row1';

          const newTableObject: TableObjectType = {
            title: 'Untitled Table',
            parentTableId: tableListId,
            id: `tableObj-${nanoid()}`,
            columns: [
              {
                id: col1Id,
                parentTableId: tableListId,
                title: 'Title 1',
                width: 200,
              },
            ],
            row: [
              {
                id: row1Id,
                parentTableId: tableListId,
                title: 'Row 1',
                cells: {
                  [col1Id]: 'sample',
                },
              },
            ],
          };

          set((state) => ({
            tables: state.tables.map((table) =>
              table.id === tableListId
                ? {
                    ...table,
                    tableObjects: [...table.tableObjects, newTableObject],
                  }
                : table
            ),
          }));
        },

        updateTableObjectTitle: (tableListId, tableObjectId, newTitle) => {
          set((state) => ({
            tables: state.tables.map((table) =>
              table.id === tableListId
                ? {
                    ...table,
                    tableObjects: table.tableObjects.map((obj) =>
                      obj.id === tableObjectId ? { ...obj, title: newTitle } : obj
                    ),
                  }
                : table
            ),
          }));
        },

        updateColumnTitle: (tableListId, tableObjectId, colId, newTitle) => {
          set((state) => ({
            tables: state.tables.map((table) =>
              table.id === tableListId
                ? {
                    ...table,
                    tableObjects: table.tableObjects.map((obj) =>
                      obj.id === tableObjectId
                        ? {
                            ...obj,
                            columns: obj.columns.map((col) =>
                              col.id === colId ? { ...col, title: newTitle } : col
                            ),
                          }
                        : obj
                    ),
                  }
                : table
            ),
          }));
        },

        updateCell: (tableListId, tableObjectId, rowId, colId, value) => {
          set((state) => ({
            tables: state.tables.map((table) =>
              table.id === tableListId
                ? {
                    ...table,
                    tableObjects: table.tableObjects.map((obj) =>
                      obj.id === tableObjectId
                        ? {
                            ...obj,
                            row: obj.row.map((r) =>
                              r.id === rowId
                                ? {
                                    ...r,
                                    cells: {
                                      ...r.cells,
                                      [colId]: value,
                                    },
                                  }
                                : r
                            ),
                          }
                        : obj
                    ),
                  }
                : table
            ),
          }));
        },

        addColumn: (tableListId, tableObjectId) => {
          set((state) => {
            const updatedTables = state.tables.map((table) => {
              if (table.id !== tableListId) return table;

              return {
                ...table,
                tableObjects: table.tableObjects.map((obj) => {
                  if (obj.id !== tableObjectId) return obj;

                  const newColId = `col-${nanoid()}`;
                  const newCol: TableColumn = {
                    id: newColId,
                    parentTableId: tableListId,
                    title: `Title ${obj.columns.length + 1}`,
                    width: 200,
                  };

                  const updatedRows = obj.row.map((r) => ({
                    ...r,
                    cells: { ...r.cells, [newColId]: '' },
                  }));

                  return {
                    ...obj,
                    columns: [...obj.columns, newCol],
                    row: updatedRows,
                  };
                }),
              };
            });

            return { tables: updatedTables };
          });
        },

        addRow: (tableListId, tableObjectId) => {
          set((state) => {
            const updatedTables = state.tables.map((table) => {
              if (table.id !== tableListId) return table;

              return {
                ...table,
                tableObjects: table.tableObjects.map((obj) => {
                  if (obj.id !== tableObjectId) return obj;

                  const newRowId = `row-${nanoid()}`;
                  const newRow: TableRow = {
                    id: newRowId,
                    parentTableId: tableListId,
                    title: `Row ${obj.row.length + 1}`,
                    cells: obj.columns.reduce((acc, col) => {
                      acc[col.id] = '';
                      return acc;
                    }, {} as Record<string, string>),
                  };

                  return {
                    ...obj,
                    row: [...obj.row, newRow],
                  };
                }),
              };
            });

            return { tables: updatedTables };
          });
        },

        deleteRow: (tableListId, tableObjectId, rowId) => {
          set((state) => ({
            tables: state.tables.map((table) =>
              table.id === tableListId
                ? {
                    ...table,
                    tableObjects: table.tableObjects.map((obj) =>
                      obj.id === tableObjectId
                        ? {
                            ...obj,
                            row: obj.row.filter((r) => r.id !== rowId),
                          }
                        : obj
                    ),
                  }
                : table
            ),
          }));
        },

        deleteColumn: (tableListId, tableObjectId, colId) => {
          set((state) => ({
            tables: state.tables.map((table) =>
              table.id === tableListId
                ? {
                    ...table,
                    tableObjects: table.tableObjects.map((obj) =>
                      obj.id === tableObjectId
                        ? {
                            ...obj,
                            columns: obj.columns.filter((col) => col.id !== colId),
                            row: obj.row.map((r) => {
                              const updatedCells = { ...r.cells };
                              delete updatedCells[colId];
                              return { ...r, cells: updatedCells };
                            }),
                          }
                        : obj
                    ),
                  }
                : table
            ),
          }));
        },
      }),
      {
        name: 'table-storage', // storage key in localStorage
      }
    )
  );

const TableContext = createContext<ReturnType<typeof createTableContext> | null>(null);

export const TableContextProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createTableContext();
  return <TableContext.Provider value={store}>{children}</TableContext.Provider>;
};

export const useTableContext = () => {
  const store = useContext(TableContext);
  if (!store) throw new Error('useTableContext must be used inside TableContextProvider');
  return store;
};
