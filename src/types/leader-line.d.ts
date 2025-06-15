declare module 'leader-line' {
  export default class LeaderLine {
    constructor(start: HTMLElement, end: HTMLElement, options?: Partial<{
      color: string;
      path: 'straight' | 'fluid' | 'magnet' | 'grid';
      startPlug: string;
      endPlug: string;
      startPlugSize: number;
      endPlugSize: number;
      size: number;
      dash: boolean | { animation: boolean };
      hide: boolean;
      dropShadow: boolean;
    }>);

    remove(): void;
    position(): void;
    show(): void;
    hide(): void;
  }
}
