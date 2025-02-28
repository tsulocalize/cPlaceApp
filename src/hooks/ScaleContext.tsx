import {createContext, useContext, useState, ReactNode, Dispatch, SetStateAction} from "react";

interface ScaleContextType {
    scale: number
    setScale: Dispatch<SetStateAction<number>>;
}

const ScaleContext = createContext<ScaleContextType | undefined>(undefined);

export const useScale = () => {
    const context = useContext(ScaleContext);
    if (!context) {
        throw new Error("ScaleContext 에러");
    }
    return context;
}

export const ScaleProvider = ({ children }: { children: ReactNode }) => {
    const [scale, setScale] = useState<number>(1);

    return (
        <ScaleContext.Provider value={{scale, setScale}}>
            {children}
        </ScaleContext.Provider>
    );
};
