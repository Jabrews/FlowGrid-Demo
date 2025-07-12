import { createContext, useContext } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NoteAreaItemType =
  | {
      id: string;
      type: "text" | "bullet";
      text: string;
    }
  | {
      id: string;
      type: "checkbox";
      text: string;
      checkboxStatus: boolean;
    };

export type NoteObject = {
  id: string;
  noteAreaItems: NoteAreaItemType[];
  title: string;
};

export type NoteListObject = {
  id: string;
  noteObjects: NoteObject[];
};

export const createNoteListContext = () =>
  create(
    persist(
      (set, get) => ({
        noteListObjects: [],

        addNoteListObject: (noteListId: string) => {
          set((state) => ({
            noteListObjects: [
              ...state.noteListObjects,
              {
                id: noteListId,
                noteObjects: [],
              },
            ],
          }));
        },

        addNoteObject: (noteListId: string) => {
          set((state) => ({
            noteListObjects: state.noteListObjects.map((list) =>
              list.id === noteListId
                ? {
                    ...list,
                    noteObjects: [
                      ...list.noteObjects,
                      {
                        id: `note-${Date.now()}`,
                        title: "Title",
                        noteAreaItems: [
                          {
                            text: "",
                            type: "text",
                            id: `item-${Date.now()}`,
                          },
                        ],
                      },
                    ],
                  }
                : list
            ),
          }));
        },

        getNoteObjects: (noteListId: string) => {
          const noteList = get().noteListObjects.find((list) => list.id === noteListId);
          return noteList ? noteList.noteObjects : [];
        },

        findTargetNoteObject: (noteListId, noteObjectId) => {
          const noteList = get().noteListObjects.find((list) => list.id === noteListId);
          if (!noteList) return null;
          return noteList.noteObjects.find((obj) => obj.id === noteObjectId) || null;
        },

        addNoteAreaItem: (noteListId, noteObjectId) => {
          set((state) => ({
            noteListObjects: state.noteListObjects.map((list) =>
              list.id === noteListId
                ? {
                    ...list,
                    noteObjects: list.noteObjects.map((obj) =>
                      obj.id === noteObjectId
                        ? {
                            ...obj,
                            noteAreaItems: [
                              ...obj.noteAreaItems,
                              {
                                id: `note-area-item-${Date.now()}`,
                                text: "",
                                type: "text",
                              },
                            ],
                          }
                        : obj
                    ),
                  }
                : list
            ),
          }));
        },

        changeNoteAreaItemText: (newText, noteListId, noteObjectId, noteItemId) => {
          set((state) => ({
            noteListObjects: state.noteListObjects.map((list) =>
              list.id === noteListId
                ? {
                    ...list,
                    noteObjects: list.noteObjects.map((obj) =>
                      obj.id === noteObjectId
                        ? {
                            ...obj,
                            noteAreaItems: obj.noteAreaItems.map((item) =>
                              item.id === noteItemId ? { ...item, text: newText } : item
                            ),
                          }
                        : obj
                    ),
                  }
                : list
            ),
          }));
        },

        getNoteAreaItemsByNoteId: (noteListId, noteObjectId) => {
          const noteObj = get().findTargetNoteObject(noteListId, noteObjectId);
          return noteObj ? noteObj.noteAreaItems : [];
        },

        deleteNoteAreaItemByNoteId: (noteListId, noteObjectId, noteItemId) => {
          set((state) => ({
            noteListObjects: state.noteListObjects.map((list) =>
              list.id === noteListId
                ? {
                    ...list,
                    noteObjects: list.noteObjects.map((obj) =>
                      obj.id === noteObjectId
                        ? {
                            ...obj,
                            noteAreaItems: obj.noteAreaItems.filter((item) => item.id !== noteItemId),
                          }
                        : obj
                    ),
                  }
                : list
            ),
          }));
        },

        cycleItemType: (noteListId, noteObjectId, noteItemId) => {
          set((state) => ({
            noteListObjects: state.noteListObjects.map((list) =>
              list.id === noteListId
                ? {
                    ...list,
                    noteObjects: list.noteObjects.map((obj) =>
                      obj.id === noteObjectId
                        ? {
                            ...obj,
                            noteAreaItems: obj.noteAreaItems.map((item) =>
                              item.id === noteItemId ? get().getNextType(item) : item
                            ),
                          }
                        : obj
                    ),
                  }
                : list
            ),
          }));
        },

        getNextType(item: NoteAreaItemType): NoteAreaItemType {
          if (item.type === "text") {
            return { ...item, type: "bullet" };
          }
          if (item.type === "bullet") {
            return { ...item, type: "checkbox", checkboxStatus: false };
          }
          if (item.type === "checkbox" && item.checkboxStatus === false) {
            return { ...item, type: "checkbox", checkboxStatus: true };
          }
          return { ...item, type: "text" };
        },

        changeNoteObjectTitle: (noteListId, noteObjectId, newTitle) => {
          set((state) => ({
            noteListObjects: state.noteListObjects.map((list) =>
              list.id === noteListId
                ? {
                    ...list,
                    noteObjects: list.noteObjects.map((obj) =>
                      obj.id === noteObjectId ? { ...obj, title: newTitle } : obj
                    ),
                  }
                : list
            ),
          }));
        },
      }),
      {
        name: "note-list-storage", // key in localStorage
      }
    )
  );

// Context setup
const NoteListContext = createContext<ReturnType<typeof createNoteListContext> | null>(null);

export const NoteListContextProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createNoteListContext();
  return <NoteListContext.Provider value={store}>{children}</NoteListContext.Provider>;
};

export const useNoteListContext = () => {
  const store = useContext(NoteListContext);
  if (!store) {
    throw new Error("useNoteListContext must be used inside NoteListContextProvider");
  }
  return store;
};
