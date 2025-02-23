import {
    createContext,
    useContext,
    useState,
    ReactNode,
    SetStateAction,
    Dispatch,
    useRef,
    MutableRefObject
} from "react";

interface PixelPositionProp {
    x: number;
    y: number;
}

interface PixelPositionContextType {
    pixelPosition: MutableRefObject<PixelPositionProp>;
    hoveredPixelPosition: PixelPositionProp;
    setHoveredPixelPosition: Dispatch<SetStateAction<PixelPositionProp>>;
    clicked: boolean;
    setClicked: Dispatch<SetStateAction<boolean>>;
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
    const pixelPosition = useRef<PixelPositionProp>({ x: 0, y: 0 });
    const [hoveredPixelPosition, setHoveredPixelPosition] = useState<PixelPositionProp>({ x: 0, y: 0 });
    const [clicked, setClicked] = useState<boolean>(false);

    return (
        <PixelPositionContext.Provider
            value={{
                pixelPosition: pixelPosition,
                hoveredPixelPosition: hoveredPixelPosition,
                setHoveredPixelPosition: setHoveredPixelPosition,
                clicked: clicked,
                setClicked: setClicked
        }}>
            {children}
        </PixelPositionContext.Provider>
    );
};
