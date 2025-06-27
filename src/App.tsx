// components
import Editor from "./components/Elements/Editor/Editor";
import { ItemFactoryProvider } from "./components/Context/ItemFactory/ItemFactoryContext";
import { PairFactoryyProvider } from "./components/Context/PairFactory/PairFactoryContext";

// timer menu context
import { TimerMenuContextProvider } from "./components/Context/TrackerMenusContext/TimerMenuContext";

// leader line context
import { ConnectionLinesContextProvider } from "./components/Context/ConnectionLines/ConnectionLines";


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
