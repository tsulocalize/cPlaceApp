import { createContext, useContext, useState, ReactNode } from "react";

interface PixelPositionProp {
    x: number;
    y: number;
}

const PixelPositionContext = createContext<PixelPositionProp>({ x: 0, y: 0 });

export const usePixelPosition = () => useContext(PixelPositionContext);

export const PixelPositionProvider = ({ children }: { children: ReactNode }) => {
    const [pixelPosition, setPixelPosition] = useState<PixelPositionProp>({ x: 0, y: 0 });
    const [hoveredPixelPosition, setHoveredPixelPosition] = useState<PixelPositionProp>({ x: 0, y: 0 });
    const [clicked, setClicked] = useState<boolean>(false);

    return (
        <PixelPositionContext.Provider
            value={{
                pixelPosition: pixelPosition,
                setPixelPosition: setPixelPosition,
                hoveredPixelPosition: hoveredPixelPosition,
                setHoveredPixelPosition: setHoveredPixelPosition,
                clicked: clicked,
                setClicked: setClicked
        }}>
            {children}
        </PixelPositionContext.Provider>
    );
};
