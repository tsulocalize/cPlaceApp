import React, { useEffect, useState, useRef } from "react";
import { usePixelPosition } from "../hooks/PixelPositionContext.tsx";
import { useZoom } from "../hooks/ZoomContext.tsx";

const MobileCoordinateDisplay: React.FC = () => {
    const { pixelPosition, hoveredPixelPosition, clicked } = usePixelPosition();
    const { zoom } = useZoom();
    const [displayedPosition, setDisplayedPosition] = useState({ x: 0, y: 0 });

    // requestAnimationFrame ID 추적용 useRef
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        // animation frame 요청 취소
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }

        const position = clicked ? pixelPosition : hoveredPixelPosition;
        if (position) {
            // requestAnimationFrame으로 상태 업데이트
            animationFrameId.current = requestAnimationFrame(() => {
                setDisplayedPosition({
                    x: position.x,
                    y: position.y
                });
            });
        }

        // 컴포넌트 언마운트 시 애니메이션 프레임 취소
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [clicked, pixelPosition, hoveredPixelPosition]);

    return (
        <div
            className="flex items-center justify-center font-sans fixed top-[5%] left-1/2 transform -translate-x-1/2 bg-white text-black px-3 py-1 rounded shadow-md text-2xl font-semibold w-[40%] min-w-[160px] max-w-full h-[5%] whitespace-pre"
        >
            {`(${displayedPosition.x},${displayedPosition.y})   x${zoom.value.toFixed(1)}`}
        </div>
    );
};

export default MobileCoordinateDisplay;
