
export type ListItems = {
  id: string;
  type: string;
};

export type ElementGroup = {
  title: string;
  items: ListItems[];
};

export const ElementList: ElementGroup[] = [
  {
    title: 'Basic Elements',
    items: [
      { type: 'Timer', id: 'Timer' },
      { type: 'Tracker', id: 'Tracker' },
      { type: 'Table-List', id: 'Table-List' },
      { type: 'Note-List', id: 'Note-List' },
    ],
  },
];
