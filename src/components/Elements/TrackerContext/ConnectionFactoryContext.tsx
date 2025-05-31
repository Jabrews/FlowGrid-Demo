import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ConnectionFactoryProvider } from "./ConnectionFactoryProvider";

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

    function addConnectedElement(newElement: TrackablePair) {
        console.log('ADDING new element:', newElement);
        setConnectedElements((prev) => [
            ...prev,
            newElement
        ]);
    }

    useEffect(() => {
        console.log('UPDATED connectedElements:', connectedElements);
    }, [connectedElements]);

    return (
        <ConnectionFactoryProvider.Provider value={{ addConnectedElement, connectedElements }}>
            {children}
        </ConnectionFactoryProvider.Provider>
    );
}
