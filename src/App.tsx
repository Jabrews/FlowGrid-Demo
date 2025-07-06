// components
import Editor from "./components/Elements/Editor/Editor";
import { ItemFactoryProvider } from "./components/Context/ItemFactory/ItemFactoryContext";
import { PairFactoryyProvider } from "./components/Context/PairFactory/PairFactoryContext";

// timer menu context
import { TimerMenuContextProvider } from "./components/Context/TrackerMenusContext/TimerMenuContext";

// leader line context
import { ConnectionLinesContextProvider } from "./components/Context/ConnectionLines/ConnectionLines";

// component contexts 
import { NoteListContextProvider } from "./components/Context/ElementContext/NoteListContext";

export default function App() {

  return (
    <ItemFactoryProvider>
      <TimerMenuContextProvider>
          <PairFactoryyProvider>
            <ConnectionLinesContextProvider>
              <NoteListContextProvider>
                <Editor/>
              </NoteListContextProvider>
            </ConnectionLinesContextProvider>
          </PairFactoryyProvider>
        </TimerMenuContextProvider>
    </ItemFactoryProvider>
  )

}
