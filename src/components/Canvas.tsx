import React, {
    useRef,
    useEffect,
} from "react";
import {PIXEL_HORIZONTAL_COUNT, PIXEL_SIZE, PIXEL_VERTICAL_COUNT} from "../constants/constant.ts";
import {usePixelPosition} from "../hooks/PixelPositionContext.tsx";
import {Color} from "../constants/colors.ts"; // API 함수 임포트

interface pixelData {
    color: Color;
    timeStamp: number;
}

interface CanvasProps {
    pixels: Map<string, pixelData>
    selectedColor: string;
    scale: number;
}

const Canvas: React.FC<CanvasProps> = ({pixels, selectedColor, scale}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {pixelPosition, setPixelPosition, hoveredPixelPosition, setHoveredPixelPosition, clicked, setClicked} = usePixelPosition();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        pixels.forEach((data, key) => {
            const [x, y] = key.split(',').map(Number);
            ctx.fillStyle = data.color;
            ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        });
    }, [pixels]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (clicked) {
            setClicked(false);
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.floor((e.clientX - rect.left) / ( PIXEL_SIZE * scale)));
        const y = Math.max(0, Math.floor((e.clientY - rect.top) / ( PIXEL_SIZE * scale)));
        setPixelPosition(prev => ({...prev, x: x, y: y}));
        setClicked(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.floor((e.clientX - rect.left) / ( PIXEL_SIZE * scale)));
        const y = Math.max(0, Math.floor((e.clientY - rect.top) / ( PIXEL_SIZE * scale)));

        setHoveredPixelPosition(prev => ({...prev, x: x, y: y}));
    };

    return (
        <div style={{
            position: "relative",
            width: 500,
            height: 500,
        }}
        >
            <canvas
                className="image-rendering-pixelated"
                ref={canvasRef}
                width={PIXEL_HORIZONTAL_COUNT * PIXEL_SIZE}
                height={PIXEL_VERTICAL_COUNT * PIXEL_SIZE}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
            />
            {!clicked && hoveredPixelPosition && (
                <div
                    style={{
                        position: "absolute",
                        top: hoveredPixelPosition.y * PIXEL_SIZE,
                        left: hoveredPixelPosition.x * PIXEL_SIZE,
                        width: `${PIXEL_SIZE}px`,
                        height: `${PIXEL_SIZE}px`,
                        border: `1px solid ${selectedColor}`,
                        boxSizing: "border-box",
                        pointerEvents: "none",
                    }}
                />
            )}
            {clicked && (
                <div
                    style={{
                        position: "absolute",
                        top: pixelPosition.y * PIXEL_SIZE,
                        left: pixelPosition.x * PIXEL_SIZE,
                        width: `${PIXEL_SIZE}px`,
                        height: `${PIXEL_SIZE}px`,
                        border: `1px solid ${selectedColor}`,
                        boxSizing: "border-box",
                        pointerEvents: "none",
                    }}
                />
            )}
        </div>
    );
};

export default Canvas;
