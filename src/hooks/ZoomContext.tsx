import { createContext, useContext, useState, ReactNode } from "react";

interface ZoomProp {
    value: number;
}

const ZoomContext = createContext<ZoomProp>({ x: 0, y: 0 });

export const useZoom = () => useContext(ZoomContext);

export const ZoomProvider = ({ children }: { children: ReactNode }) => {
    const [zoom, setZoom] = useState<ZoomProp>({ value: 0.5 });

    return (
        <ZoomContext.Provider value={{zoom, setZoom}}>
            {children}
        </ZoomContext.Provider>
    );
};
