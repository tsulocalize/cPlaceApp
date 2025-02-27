import { useRef } from "react";
import {PIXEL_SIZE} from "../constants/constant.ts";

export let globalCtx: CanvasRenderingContext2D | null = null;

// Getter 함수
export const getGlobalCanvasRef = () => globalCtx;

// Setter 함수
export const setGlobalCanvasRef = (canvas: CanvasRenderingContext2D | null) => {
    globalCtx = canvas;
};

export const usePixelQueue = () => {
    const pixelQueue = useRef<{ x: number; y: number; color: string }[]>([]);
    const animationFrameId = useRef<number | null>(null);

    const drawNextPixel = () => {
        if (pixelQueue.current.length === 0) {
            animationFrameId.current = null; // 애니메이션 종료
            return;
        }
        if (!globalCtx) return;

        let count = 0;
        while (pixelQueue.current.length > 0 && count < 500) {
            const { x, y, color } = pixelQueue.current.shift()!; // 큐에서 하나 꺼냄
            globalCtx.fillStyle = color;
            globalCtx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            count++;
        }

        animationFrameId.current = requestAnimationFrame(() => drawNextPixel());
    };

    const startDrawing = () => {
        if (!animationFrameId.current) {
            drawNextPixel(); // 애니메이션 시작
        }
    };

    const addPixelToQueue = (x: number, y: number, color: string) => {
        pixelQueue.current.push({ x, y, color });
        startDrawing();
    };

    return { addPixelToQueue };
};
