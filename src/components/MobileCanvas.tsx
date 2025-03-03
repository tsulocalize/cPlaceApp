import React, {
    useRef,
    useEffect, useState,
} from "react";
import {PIXEL_HORIZONTAL_COUNT, PIXEL_SIZE, PIXEL_VERTICAL_COUNT} from "../constants/constant.ts";
import {usePixelPosition} from "../hooks/PixelPositionContext.tsx";
import {setGlobalCanvasRef} from "../hooks/usePixelQueue.ts";

interface CanvasProps {
    selectedColor: string;
    scale: number;
}

interface Prev {
    x: number;
    y: number;
}

const MobileCanvas: React.FC<CanvasProps> = ({selectedColor, scale}) => {
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {setPixelPosition} = usePixelPosition();
    const [prevPixelPosition, setPrevPixelPosition] = useState<Prev | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        setGlobalCanvasRef(ctx);
    }, []);

    const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0]; // 첫 번째 터치 이벤트 가져오기
        const x = Math.max(0, Math.floor((touch.clientX - rect.left) / (PIXEL_SIZE * scale)));
        const y = Math.max(0, Math.floor((touch.clientY - rect.top) / (PIXEL_SIZE * scale)));

        setPixelPosition({ x, y });
    };

    const handleCanvasTouch2 = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const overlayCanvas = overlayCanvasRef.current;
        if (!overlayCanvas) return;

        const overlayCtx = overlayCanvas.getContext("2d");
        if (!overlayCtx) return;

        if (prevPixelPosition) {
            overlayCtx.clearRect(prevPixelPosition.x * PIXEL_SIZE, prevPixelPosition.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }

        const rect = overlayCanvas.getBoundingClientRect();
        const touch = e.touches[0]; // 첫 번째 터치 이벤트 가져오기
        const x = Math.max(0, Math.floor((touch.clientX - rect.left) / (PIXEL_SIZE * scale)));
        const y = Math.max(0, Math.floor((touch.clientY - rect.top) / (PIXEL_SIZE * scale)));

        overlayCtx.fillStyle = selectedColor;
        overlayCtx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);

        setPixelPosition({ x, y });
        setPrevPixelPosition({x, y});
    };

    return (
        <div style={{
            position: "relative",
            width: 500,
            height: 500,
        }}
        >
            <div style={{
                position: "relative",
                width: 500,
                height: 500
            }}>
                <canvas
                    className="image-rendering-pixelated absolute"
                    ref={canvasRef}
                    width={PIXEL_HORIZONTAL_COUNT * PIXEL_SIZE}
                    height={PIXEL_VERTICAL_COUNT * PIXEL_SIZE}
                    onTouchStart={handleCanvasTouch}
                />
                <canvas
                    className="image-rendering-pixelated absolute"
                    ref={overlayCanvasRef}
                    width={PIXEL_HORIZONTAL_COUNT * PIXEL_SIZE}
                    height={PIXEL_VERTICAL_COUNT * PIXEL_SIZE}
                    onTouchStart={handleCanvasTouch2}
                />
            </div>
            {/*<div*/}
            {/*    style={{*/}
            {/*        position: "absolute",*/}
            {/*        top: Math.round(pixelPosition.y) * PIXEL_SIZE,*/}
            {/*        left: Math.round(pixelPosition.x) * PIXEL_SIZE,*/}
            {/*        width: `${PIXEL_SIZE}px`,*/}
            {/*        height: `${PIXEL_SIZE}px`,*/}
            {/*        backgroundColor: `${selectedColor}`,*/}
            {/*        boxSizing: "border-box",*/}
            {/*        pointerEvents: "none",*/}
            {/*        imageRendering: "pixelated"*/}
            {/*    }}*/}
            {/*/>*/}
        </div>
    );
};

export default MobileCanvas;
