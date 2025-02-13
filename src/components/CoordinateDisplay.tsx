import React from "react";
import {usePixelPosition} from "../hooks/PixelPositionContext.tsx";
import {useZoom} from "../hooks/ZoomContext.tsx";

const CoordinateDisplay: React.FC = () => {
    const {pixelPosition, hoveredPixelPosition, clicked} = usePixelPosition();

    const {zoom} = useZoom();

    return (
        <div
            className="font-mono fixed top-2 left-1/2 transform -translate-x-1/2 bg-white text-black px-3 py-1 rounded shadow-md text-base font-semibold w-[150px] max-w-[150px] h-8 "
        >
            {clicked ? `(${pixelPosition?.x},${pixelPosition?.y}) x${zoom.value.toFixed(1)}`
            : `(${hoveredPixelPosition?.x},${hoveredPixelPosition?.y}) x${zoom.value.toFixed(1)}`}
        </div>
    );
};

export default CoordinateDisplay;
