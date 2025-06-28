import { createContext, useContext, useRef } from "react";
import { create } from "zustand";

export type lineElem = {
  trackerId: string;
  itemId: string;
  inputRect: DOMRect | null;
  outputRect: DOMRect | null;
};

// helper function to get svg from a component element
function getSvgFromComponent(
  element: HTMLDivElement | null,
  selector: ".tracker-input" | ".tracker-output"
): SVGElement | null {
  const target = element?.querySelector(selector);
  const svg = target?.querySelector("svg") || null;
  return svg;
}

// store factory
const createConnectionLinesStore = () =>
  create((set, get) => ({
    elementRefs: useRef<{ [key: string]: HTMLDivElement | null }>({}),
    lineElems: [] as lineElem[],

    setLineElems: (inputParentId: string, outputParentId: string) => {
      set((state) => ({
        
        lineElems: [
          ...state.lineElems,
          {
            trackerId: inputParentId,
            itemId: outputParentId,
            inputRect: null,
            outputRect: null,
          },
        ],
      }));

      setTimeout(() => {
        const state = get();
        const trackerEl = state.elementRefs.current[inputParentId];
        const itemEl = state.elementRefs.current[outputParentId];

        const inputSvg = getSvgFromComponent(trackerEl, ".tracker-input");
        const outputSvg = getSvgFromComponent(itemEl, ".tracker-output");

        const updatedLineElems = state.lineElems.map((line) => {
          if (
            line.trackerId === inputParentId &&
            line.itemId === outputParentId
          ) {
            return {
              ...line,
              inputRect: inputSvg?.getBoundingClientRect() || null,
              outputRect: outputSvg?.getBoundingClientRect() || null,
            };
          }
          return line;
        });

        set({ lineElems: updatedLineElems });
      }, 10);
    },

    removeLineElem: (itemId: string) =>
      set((state) => ({
        lineElems: state.lineElems.filter((item: lineElem) => item.itemId !== itemId),
      })),


    refreshLineElems: (connectedItems: any[]) => {
      set(() => ({
        lineElems: connectedItems.map((pair) => ({
          trackerId: pair.tracker.id,
          itemId: pair.item.id,
          inputRect: null,
          outputRect: null,
        })),
      }));

      setTimeout(() => {
        const state = get();
        set(() => ({
          lineElems: connectedItems.map((pair) => {
            const trackerEl = state.elementRefs.current[pair.tracker.id];
            const itemEl = state.elementRefs.current[pair.item.id];

            const inputSvg = getSvgFromComponent(trackerEl, ".tracker-input");
            const outputSvg = getSvgFromComponent(itemEl, ".tracker-output");

            return {
              trackerId: pair.tracker.id,
              itemId: pair.item.id,
              inputRect: inputSvg?.getBoundingClientRect() || null,
              outputRect: outputSvg?.getBoundingClientRect() || null,
            };
          }),
        }));
      }, 10);
    },

    clearLineRects: () => {
      set((state) => ({
        lineElems: state.lineElems.map((line) => ({
          ...line,
          inputRect: null,
          outputRect: null,
        })),
      }));
    },

    restoreLineRects: () => {
      const state = get();
      const updated = state.lineElems.map((line) => {
        const trackerEl = state.elementRefs.current[line.trackerId];
        const itemEl = state.elementRefs.current[line.itemId];

        const inputSvg = getSvgFromComponent(trackerEl, ".tracker-input");
        const outputSvg = getSvgFromComponent(itemEl, ".tracker-output");

        return {
          ...line,
          inputRect: inputSvg?.getBoundingClientRect() || null,
          outputRect: outputSvg?.getBoundingClientRect() || null,
        };
      });

      set({ lineElems: updated });
    },

    pausedLineId: null as string | null,
    setPausedLineId: (id: string) => set({ pausedLineId: id }),

    pauseLine: () => {
      const state = get();
      const updated = state.lineElems.map((line) => {
        if (
          state.pausedLineId === line.trackerId ||
          state.pausedLineId === line.itemId
        ) {
          return {
            ...line,
            inputRect: null,
            outputRect: null,
          };
        }
        return line;
      });
      set({ lineElems: updated });
    },

    resumeLine: () => {
      const state = get();
      const updated = state.lineElems.map((line) => {
        if (
          state.pausedLineId === line.trackerId ||
          state.pausedLineId === line.itemId
        ) {
          const trackerEl = state.elementRefs.current[line.trackerId];
          const itemEl = state.elementRefs.current[line.itemId];

          const inputSvg = getSvgFromComponent(trackerEl, ".tracker-input");
          const outputSvg = getSvgFromComponent(itemEl, ".tracker-output");

          return {
            ...line,
            inputRect: inputSvg?.getBoundingClientRect() || null,
            outputRect: outputSvg?.getBoundingClientRect() || null,
          };
        }
        return line;
      });

      set({ lineElems: updated, pausedLineId: null });
    },

    isScrolling: false,
    setScrolling: (scrolling: boolean) => set({ isScrolling: scrolling }),
  }));


// context
const connectionLinesContext = createContext(null);

export const ConnectionLinesContextProvider = ({ children }) => {
  const store = createConnectionLinesStore();
  return (
    <connectionLinesContext.Provider value={store}>
      {children}
    </connectionLinesContext.Provider>
  );
};

export const useConnectionLinesContext = () => {
  const store = useContext(connectionLinesContext);
  if (!store)
    throw new Error(
      "useConnectionLinesContext must be used inside ConnectionLinesContextProvider"
    );
  return store;
};
