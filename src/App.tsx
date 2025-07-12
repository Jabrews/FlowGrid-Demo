// components
import Editor from "./Components/Elements/Editor/Editor";
import { ItemFactoryProvider } from "./Context/ItemFactory/ItemFactoryContext";
import { PairFactoryyProvider } from "./Context/PairFactory/PairFactoryContext";

// timer menu context
import { TimerMenuContextProvider } from ".//Context/TrackerMenusContext/TimerMenuContext";

// leader line context
import { ConnectionLinesContextProvider } from "./Context/ConnectionLines/ConnectionLines";

export default function App() {

  return (
    <ItemFactoryProvider>
      <TimerMenuContextProvider>
          <PairFactoryyProvider>
            <ConnectionLinesContextProvider>
                <Editor/>
            </ConnectionLinesContextProvider>
          </PairFactoryyProvider>
        </TimerMenuContextProvider>
    </ItemFactoryProvider>
  )

}
