import React, {useEffect, useRef, useState} from "react";
import {useZoom} from "../hooks/ZoomContext.tsx";
import {useScale} from "../hooks/ScaleContext.tsx";
import MobileCanvas from "./MobileCanvas.tsx";

interface CanvasContainerProps {
    selectedColor: string;
}

const MobileCanvasContainer:React.FC<CanvasContainerProps> = ({selectedColor}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {scale} = useScale();
    const [position, setPosition] = useState({x : 0, y : 0});
    const startPosition = useRef({x : 0, y : 0});
    const [isDragging, setIsDragging] = useState(false);
    const {setZoom} = useZoom();

    useEffect(() => {
        setZoom(prev => ({...prev, value:  Math.round(scale * 10) / 10}));
        setPosition(prev => ({
            x: prev.x < 500 * (1 - scale) ? Math.min(0, 500 * (1 - scale)) : prev.x,
            y: prev.y < 500 * (1 - scale) ? Math.min(0, 500 * (1 - scale))  : prev.y,
        }));
    }, [scale]);

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0]; // 첫 번째 터치 가져오기
        startPosition.current = { x: touch.clientX, y: touch.clientY };
        setIsDragging(true);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;

        const touch = e.touches[0]; // 첫 번째 터치 이벤트 가져오기
        const dx = touch.clientX - startPosition.current.x;
        const dy = touch.clientY - startPosition.current.y;

        const newX = Math.max(Math.min(0, position.x + dx), 250 - 500 * scale);
        const newY = Math.max(Math.min(0, position.y + dy), 250 - 500 * scale);

        setPosition({ x: newX, y: newY });
        startPosition.current = { x: touch.clientX, y: touch.clientY };
    };

    console.log(position.x, position.y)

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}

            style={{
                position: "relative",
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "top left",
                touchAction: "none",
                width: 250,
                height: 250
        }}>
            <MobileCanvas
                selectedColor={selectedColor}
                scale={scale}
            />
         </div>
    )
}

export default MobileCanvasContainer;
