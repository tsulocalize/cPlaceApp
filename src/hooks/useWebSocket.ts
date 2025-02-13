import { useEffect, useRef } from "react";

interface Pixel {
    x: number;
    y: number;
    color: string;
}

export const useWebSocket = (onMessage: (pixel: Pixel[]) => void) => {
    const socketRef = useRef<WebSocket | null>(null);
    const messageQueue: Pixel[][] = []; // 💡 웹소켓 메시지를 저장할 큐
    let isProcessing = false; // 💡 현재 메시지 처리 중인지 확인하는 플래그

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = new WebSocket(import.meta.env.VITE_WS_URL);

            socketRef.current.onopen = () => console.log("✅ WebSocket 연결됨");

            socketRef.current.onmessage = (event) => {
                const pixelBatch: Pixel[] = JSON.parse(event.data); // 💡 웹소켓에서 배열 형태의 픽셀 데이터 수신
                messageQueue.push(pixelBatch); // 💡 받은 메시지를 큐에 저장
                processQueue(); // 💡 메시지 처리 함수 실행
            };

            socketRef.current.onclose = () => {
                console.log("🔴 WebSocket 연결 종료");
                socketRef.current = null;
            };

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

        while (messageQueue.length > 0) {
            const currentBatch = messageQueue.shift(); // 💡 큐에서 가장 오래된 메시지 꺼냄
            if (!currentBatch) continue;

            // 💡 메시지 내부의 픽셀들은 병렬 처리
            // await Promise.all(currentBatch.map(({ x, y, color }) => onMessage({ x, y, color })));
            onMessage(currentBatch);
        }

        isProcessing = false;
    };
};
