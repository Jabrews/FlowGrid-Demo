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
import { TableContextProvider} from './components/Context/ElementContext/TableContext'


export default function App() {

  return (
    <ItemFactoryProvider>
      <TimerMenuContextProvider>
          <PairFactoryyProvider>
            <ConnectionLinesContextProvider>
              <NoteListContextProvider>
              <TableContextProvider>
                <Editor/>
              </TableContextProvider>
              </NoteListContextProvider>
            </ConnectionLinesContextProvider>
          </PairFactoryyProvider>
        </TimerMenuContextProvider>
    </ItemFactoryProvider>
  )

}
