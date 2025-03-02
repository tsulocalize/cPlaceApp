import React from "react";
import { usePixelPosition } from "../hooks/PixelPositionContext.tsx";
import { useZoom } from "../hooks/ZoomContext.tsx";

const MobileCoordinateDisplay: React.FC = () => {
    const { pixelPosition } = usePixelPosition();
    const { zoom } = useZoom();

    return (
        <div
            className="flex items-center justify-center font-sans bg-white text-black px-3 py-1 rounded shadow-md text-lg font-semibold w-[40%] min-w-[160px] max-w-full h-[100%] whitespace-pre"
        >
            {`(${pixelPosition.x},${pixelPosition.y})   x${zoom.value.toFixed(1)}`}
        </div>
    );
};

export default MobileCoordinateDisplay;
