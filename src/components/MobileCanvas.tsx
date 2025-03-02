import React, {
    useRef,
    useEffect,
} from "react";
import {PIXEL_HORIZONTAL_COUNT, PIXEL_SIZE, PIXEL_VERTICAL_COUNT} from "../constants/constant.ts";
import {usePixelPosition} from "../hooks/PixelPositionContext.tsx";
import {setGlobalCanvasRef} from "../hooks/usePixelQueue.ts";

interface CanvasProps {
    selectedColor: string;
    scale: number;
}

const MobileCanvas: React.FC<CanvasProps> = ({selectedColor, scale}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {pixelPosition, setPixelPosition} = usePixelPosition();

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
                onTouchStart={handleCanvasTouch}
            />
            <div
                style={{
                    position: "absolute",
                    top: pixelPosition.y * PIXEL_SIZE,
                    left: pixelPosition.x * PIXEL_SIZE,
                    width: `${PIXEL_SIZE}px`,
                    height: `${PIXEL_SIZE}px`,
                    backgroundColor: `${selectedColor}`,
                    boxSizing: "border-box",
                    pointerEvents: "none",
                    imageRendering: "pixelated"
                }}
            />
        </div>
    );
};

export default MobileCanvas;
