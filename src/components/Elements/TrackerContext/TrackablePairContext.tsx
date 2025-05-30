import { createContext } from "react";


export type TrackablePair = {
    input: string;
    output: string;
    inputParent: string;
    outputParent: string;
};


type AddConnectedElement = (newElement: TrackablePair) => void;


export const TrackablePairContext = createContext<AddConnectedElement | null>(null);