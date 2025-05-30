import  {useState } from "react";
import type { ReactNode } from "react";
import { TrackablePairContext } from "./TrackablePairContext";

export type TrackablePair = {
    input: string;
    output: string;
    inputParent: string;
    outputParent: string;
};

export type ConnectionFactoryContextProps = {
    children: ReactNode;
};

export default function ConnectionFactoryContext({ children }: ConnectionFactoryContextProps) {
    const [connectedElements, setConnectedElements] = useState<TrackablePair[]>([
        { input: 'example', output: 'example', inputParent: 'example', outputParent: 'example' }
    ]);

    function addConnectedElements(newElement: TrackablePair) {
        setConnectedElements((prev) => [
            ...prev,
            newElement
        ]);

        console.log('Connection Factory elements: ', connectedElements)
}

    return (
        <TrackablePairContext.Provider value={addConnectedElements}>
            {children}
        </TrackablePairContext.Provider>
    );
}
