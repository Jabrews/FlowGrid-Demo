import { createContext, useContext } from "react";
import { create } from "zustand";

export const createViewportPanStore = (
  () =>
    create<{
      clamp : (val : number, max : number) => number;
      isScrolling: boolean;
      mouseAnchorPos: { x: number; y: number };
      currentMousePos: { x: number; y: number };
      setIsScrolling: (status: boolean) => void;
      setMouseAnchorPos: (pos: { x: number; y: number }) => void;
      updateCurrentMousePos: (pos: { x: number; y: number }) => void;
      getScrollDelta: () => { x: number; y: number };



    }>((set, get) => ({
      clamp : (val : number, max : number) => {
        return Math.max(-max, Math.min(val, max));
      },
      isScrolling: false,
      mouseAnchorPos: { x: 0, y: 0 },
      currentMousePos: { x: 0, y: 0 },

      setIsScrolling: (status) => set(() => ({ isScrolling: status })),

      setMouseAnchorPos: (pos) => set(() => ({ mouseAnchorPos: pos })),

      updateCurrentMousePos: (pos) => set(() => ({ currentMousePos: pos })),

      getScrollDelta: () => {
        const speed = 0.35;
        const maxDelta = 30;
        const AXIS_LOCK_RATIO = 2;

        const { x: ax, y: ay } = get().mouseAnchorPos;
        const { x: mx, y: my } = get().currentMousePos;

        let dx = (mx - ax) * speed;
        let dy = (my - ay) * speed;

        if (Math.abs(dx) > AXIS_LOCK_RATIO * Math.abs(dy)) {
          dy = 0;
        } else if (Math.abs(dy) > AXIS_LOCK_RATIO * Math.abs(dx)) {
          dx = 0;
        }

        const clamp = (val: number, max: number) => Math.max(-max, Math.min(val, max));
        dx = clamp(dx, maxDelta);
        dy = clamp(dy, maxDelta);

        return { x: dx, y: dy };
      },
    })))


const ViewportPanContext = createContext<ReturnType<typeof createViewportPanStore> | null>(null);

export const ViewportPanContextProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createViewportPanStore();
  return (
    <ViewportPanContext.Provider value={store}>
      {children}
    </ViewportPanContext.Provider>
  );
};

export const useViewportPanStore = () => {
  const store = useContext(ViewportPanContext);
  if (!store) {
    throw new Error("useViewportPanStore must be used inside ViewportPanContextProvider");
  }
  return store;
};
