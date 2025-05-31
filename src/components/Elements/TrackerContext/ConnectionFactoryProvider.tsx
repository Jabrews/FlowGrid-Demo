import { createContext } from "react";


export type TrackablePair = {
    input: string;
    output: string;
    inputParent: string;
    outputParent: string;
};


export type AddConnectedElement = (newElement: TrackablePair) => void;


export type ConnectionFactoryContextType = {
    connectedElements: TrackablePair[];
    addConnectedElement: AddConnectedElement;
};


export const ConnectionFactoryProvider = createContext< ConnectionFactoryContextType | null>(null);