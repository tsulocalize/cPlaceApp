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

const Canvas: React.FC<CanvasProps> = ({selectedColor, scale}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {pixelPosition, setPixelPosition, hoveredPixelPosition, setHoveredPixelPosition, clicked, setClicked} = usePixelPosition();
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        setGlobalCanvasRef(ctx);
    }, []);

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
        setPixelPosition( {x, y});
        setClicked(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }

        animationFrameId.current = requestAnimationFrame(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = Math.max(0, Math.floor((e.clientX - rect.left) / (PIXEL_SIZE * scale)));
            const y = Math.max(0, Math.floor((e.clientY - rect.top) / (PIXEL_SIZE * scale)));

            setHoveredPixelPosition({ x, y }); // 프레임 단위로 업데이트
        });
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
                        backgroundColor: `${selectedColor}`,
                        boxSizing: "border-box",
                        pointerEvents: "none",
                        willChange: "transform"
                    }}
                />
            )}
            {clicked && (
                <div
                    style={{
                        position: "absolute",
                        top: pixelPosition.y * PIXEL_SIZE,
                        left: pixelPosition.x * PIXEL_SIZE,
                        width: `${PIXEL_SIZE * Math.round(window.devicePixelRatio) / window.devicePixelRatio}px`,
                        height: `${PIXEL_SIZE * Math.round(window.devicePixelRatio) / window.devicePixelRatio}px`,
                        backgroundColor: `${selectedColor}`,
                        boxSizing: "border-box",
                        pointerEvents: "none",
                        imageRendering: "pixelated"
                    }}
                />
            )}
        </div>
    );
};

export default Canvas;
