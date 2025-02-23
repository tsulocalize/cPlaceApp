import { useEffect, useRef } from "react";

interface PixelMedia {
    x: number;
    y: number;
    colorIndex: number;
    timeStamp: number;
}

export const useWebSocket = (onMessage: (pixels: PixelMedia[]) => void) => {
    const socketRef = useRef<WebSocket | null>(null);
    const messageQueue: PixelMedia[] = []; // 💡 웹소켓 메시지를 저장할 큐
    let isProcessing = false; // 💡 현재 메시지 처리 중인지 확인하는 플래그

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
                for (let i = 0; i < buffer.byteLength; i += 10) {
                    const x = buffer.getUint16(i, false);
                    const y = buffer.getUint16(i + 2, false);
                    const colorIndex = buffer.getUint8(i + 4);
                    const timeStamp = buffer.getUint32(i + 6, false);

                    messageQueue.push({ x, y, colorIndex, timeStamp });
                }

                processQueue(); // 💡 메시지 처리 함수 실행
            };

            ws.onclose = () => {
                console.log("🔴 WebSocket 연결 종료");
                socketRef.current = null;
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

    // 💡 메시지를 순서대로 실행하는 함수
    const processQueue = async () => {
        if (isProcessing) return; // 이미 실행 중이면 리턴
        isProcessing = true;

        const promise = [];

        while (messageQueue.length > 0) {
            const updatedPixel = messageQueue.shift(); // 💡 큐에서 가장 오래된 메시지 꺼냄
            if (!updatedPixel) continue;

            // 💡 메시지 내부의 픽셀들은 병렬 처리
            promise.push(updatedPixel);
        }
        onMessage(promise);

        isProcessing = false;
    };
};
