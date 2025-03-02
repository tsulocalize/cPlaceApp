import {createContext, useContext, useState, ReactNode, SetStateAction, Dispatch} from "react";

interface PixelPositionProp {
    x: number;
    y: number;
}

interface PixelPositionContextType {
    pixelPosition: PixelPositionProp;
    setPixelPosition: Dispatch<SetStateAction<PixelPositionProp>>;
    hoveredPixelPosition: PixelPositionProp;
    setHoveredPixelPosition: Dispatch<SetStateAction<PixelPositionProp>>;
    clicked: boolean;
    setClicked: Dispatch<SetStateAction<boolean>>;
    touched: boolean;
    setTouched: Dispatch<SetStateAction<boolean>>;
}

const PixelPositionContext = createContext<PixelPositionContextType | undefined>(undefined);

export const usePixelPosition = () => {
    const context = useContext(PixelPositionContext);
    if (!context) {
        throw new Error("PixelPosition 에러");
    }
    return context;
}

export const PixelPositionProvider = ({ children }: { children: ReactNode }) => {
    const [pixelPosition, setPixelPosition] = useState<PixelPositionProp>({ x: 0, y: 0 });
    const [hoveredPixelPosition, setHoveredPixelPosition] = useState<PixelPositionProp>({ x: 0, y: 0 });
    const [clicked, setClicked] = useState<boolean>(false);
    const [touched, setTouched] = useState<boolean>(false);

    return (
        <PixelPositionContext.Provider
            value={{
                pixelPosition: pixelPosition,
                setPixelPosition: setPixelPosition,
                hoveredPixelPosition: hoveredPixelPosition,
                setHoveredPixelPosition: setHoveredPixelPosition,
                clicked: clicked,
                setClicked: setClicked,
                touched: touched,
                setTouched: setTouched
        }}>
            {children}
        </PixelPositionContext.Provider>
    );
};
