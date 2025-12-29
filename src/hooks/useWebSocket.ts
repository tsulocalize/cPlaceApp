import { useEffect, useRef } from "react";
import {usePixelQueue} from "./usePixelQueue.ts";
import {Color} from "../constants/colors.ts";

interface PixelData {
    x: number
    y: number
    colorIndex: number
}

export const useWebSocket = (isLoading: boolean) => {
    const socketRef = useRef<WebSocket | null>(null);
    const { addPixelToQueue } = usePixelQueue();
    const loadingQueue:PixelData[] = [];
    const useLoadingQueue = useRef(true);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!socketRef.current) {
            const ws = new WebSocket(import.meta.env.VITE_WS_URL);
            ws.binaryType = "arraybuffer";

            ws.onopen = () => {
                console.log("✅ WebSocket 연결됨");
            }

            ws.onmessage = (event) => {
                const buffer = new DataView(event.data);
                for (let i = 0; i < buffer.byteLength; i += 6) {
                    const x = buffer.getUint16(i, false);
                    const y = buffer.getUint16(i + 2, false);
                    const colorIndex = buffer.getUint8(i + 4);

                    waitLoading(x, y, colorIndex);
                }
            };

            ws.onclose = () => {
                console.log("🔴 WebSocket 연결 종료");
                socketRef.current = null;
                setTimeout(() => {
                    alert("서버와 연결이 종료되었습니다.");
                }, 1000); // 모바일 탭 전환 오류 방지용
            };

            socketRef.current = ws;

            return () => {
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    console.log("🛑 WebSocket 닫음");
                    socketRef.current.close();
                }
            };
        }
    }, []);

    const waitLoading = (x:number, y:number, colorIndex:number) => {
        if (useLoadingQueue.current) {
            loadingQueue.push({x, y, colorIndex});
            return;
        }

        addPixelToQueue(x, y, Object.values(Color)[colorIndex]);
    }

    useEffect(() => {
        if (!isLoading) {
            while (loadingQueue.length > 0) {
                const pixelData = loadingQueue.shift();
                if (!pixelData) return;
                addPixelToQueue(pixelData.x, pixelData.y, Object.values(Color)[pixelData.colorIndex]);
            }
        }
    }, [isLoading]);

    useEffect(() => {
        useLoadingQueue.current = isLoading;
    }, [isLoading]);
};
