import React, {useEffect, useRef, useState} from "react";
import Canvas from "./Canvas.tsx";
import {useZoom} from "../hooks/ZoomContext.tsx";
import {MAX_ZOOM, MIN_ZOOM} from "../constants/constant.ts";

interface CanvasContainerProps {
    selectedColor: string;
}

const CanvasContainer:React.FC<CanvasContainerProps> = ({selectedColor}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({x : 0, y : 0});
    const startPosition = useRef({x : 0, y : 0});
    const [isDragging, setIsDragging] = useState(false);
    const {setZoom} = useZoom();

    useEffect(() => {
        setZoom(prev => ({...prev, value:  Math.round(scale * 10) / 10}));
    }, [scale]);

    const handleMouseDown = (e : React.MouseEvent) => {
        startPosition.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
    }
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const dx = e.clientX - startPosition.current.x;
        const dy = e.clientY - startPosition.current.y;

        const newX = Math.max(Math.min(0, position.x + dx), ( 1 - scale ) * 500);
        const newY = Math.max(Math.min(0, position.y + dy), ( 1 - scale ) * 500);

        setPosition( {x : newX, y : newY})
        startPosition.current = {x : e.clientX, y: e.clientY};
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        setScale(Math.min(Math.max(scale - (e.deltaY * 0.0005), MIN_ZOOM), MAX_ZOOM));
    }

    window.addEventListener('wheel', handleWheel, { passive: false });

    return (
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={() => handleWheel}

            style={{
            position: "relative",
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "top left",
            touchAction: "none"
        }}>
            <Canvas
                selectedColor={selectedColor}
                scale={scale}
            />
         </div>
    )
}

export default CanvasContainer;
