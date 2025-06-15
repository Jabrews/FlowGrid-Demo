import { createContext, useContext } from 'react';
import { create } from 'zustand';

export type connectionLinesPair = {
  startId: string;
  endId: string;
  lineStatus: 'active' | 'idle' | 'standby';
};

type ConnectionLinesStore = {
  connectionLines: connectionLinesPair[];
  addConnectionLine: (startId: string, endId: string) => void;
  removeConnectionLine: (startId: string, endId: string) => void;
  clearConnections: () => void;
};

const useConnectionLinesStore = create<ConnectionLinesStore>((set) => ({
  connectionLines: [],
  
  addConnectionLine: (startId, endId) =>
    set((state) => ({
      connectionLines: [
        ...state.connectionLines,
        { startId, endId, lineStatus: 'active' }
      ],
    })),

  removeConnectionLine: (startId, endId) =>
    set((state) => ({
      connectionLines: state.connectionLines.filter(
        (line) => !(line.startId === startId && line.endId === endId)
      ),
    })),

  clearConnections: () => set({ connectionLines: [] }),
}));

const ConnectionLinesContext = createContext<typeof useConnectionLinesStore | null>(null);

export const ConnectionLinesContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConnectionLinesContext.Provider value={useConnectionLinesStore}>
      {children}
    </ConnectionLinesContext.Provider>
  );
};

export const useConnectionLinesContext = () => {
  const store = useContext(ConnectionLinesContext);
  if (!store) throw new Error("useConnectionLinesContext must be used within a ConnectionLinesContextProvider");
  return store;
};
