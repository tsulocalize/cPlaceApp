import {createContext, useContext, useState, ReactNode, Dispatch, SetStateAction} from "react";

interface ZoomProp {
    value: number;
}

interface ZoomContextType {
    zoom: ZoomProp
    setZoom: Dispatch<SetStateAction<ZoomProp>>;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

export const useZoom = () => {
    const context = useContext(ZoomContext);
    if (!context) {
        throw new Error("ZoomContext 에러");
    }
    return context;
}

export const ZoomProvider = ({ children }: { children: ReactNode }) => {
    const [zoom, setZoom] = useState<ZoomProp>({ value: 0.5 });

    return (
        <ZoomContext.Provider value={{zoom, setZoom}}>
            {children}
        </ZoomContext.Provider>
    );
};
