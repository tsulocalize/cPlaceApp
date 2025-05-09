import './Home.css'
import ColorPalette from "./components/ColorPalette.tsx";
import {useEffect, useRef, useState} from "react";
import {useWebSocket} from "./hooks/useWebSocket.ts";
import {getDirtySet, getPixels, updatePixel} from "./services/api.ts";
import {usePixelPosition} from "./hooks/PixelPositionContext.tsx";
import {ZoomProvider} from "./hooks/ZoomContext.tsx";
import {Color} from "./constants/colors.ts";
import {usePixelQueue} from "./hooks/usePixelQueue.ts";
import {useInitialize} from "./hooks/useInitailize.ts";
import MobileTimerButton from "./components/MobileTimerButton.tsx";
import MobileCoordinateDisplay from "./components/MobileCoordinateDisplay.tsx";
import MobileZoomController from "./components/MobileZoomController.tsx";
import MobileFrame from "./components/MobileFrame.tsx";

function MobileHome() {
    const [selectedColor, setSelectedColor] = useState(Color.BLACK);
    const {pixelPosition} = usePixelPosition();
    const { addPixelToQueue } = usePixelQueue();
    const { drawMap } = useInitialize();
    const lastUpdated = useRef<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getPixels()
                .then(buffer => {
                    lastUpdated.current = getLongFromUint8Array(buffer);
                    drawMap(buffer, 8);
                }).then(() => {
                    getDirtySet(lastUpdated.current!)
                        .then(buffer => {
                            const dataView = new DataView(buffer.buffer);
                            for (let i = 0; i < dataView.byteLength; i += 6) {
                                const x = dataView.getUint16(i, false);
                                const y = dataView.getUint16(i + 2, false);
                                const colorIndex = dataView.getUint8(i + 4);

                                addPixelToQueue(x, y, Object.values(Color)[colorIndex]);
                            }
                        })
                    setIsLoading(false);
        });
    }, []);

    // WebSocket 훅 사용
    useWebSocket(isLoading);

    const handleColorSelect = (color: Color) => {
        setSelectedColor(color); // 색상 변경
    };

    const updateColor = async () => {
        return await updatePixel(pixelPosition?.x, pixelPosition?.y, selectedColor);
    }

    return (
        <div className="flex justify-center">
            <ZoomProvider>
                <div className="flex fixed top-[6%] w-[80%] justify-center items-center h-[5%] gap-3">
                    <MobileZoomController key="minus" isPlus={false}/>
                    <MobileCoordinateDisplay/>
                    <MobileZoomController key="plus" isPlus={true}/>
                </div>
                <div className="flex flex-col gap-5 mt-32">
                    <MobileFrame selectedColor={selectedColor}/>
                    <ColorPalette selectedColor={selectedColor} onSelectColor={handleColorSelect} isMobile={true}/>
                </div>
                <MobileTimerButton onTouch={updateColor} timeLimit={import.meta.env.VITE_TIME_LIMIT}
                                   selectedColor={selectedColor}/>
            </ZoomProvider>
        </div>
    );
}

export default MobileHome;

function getLongFromUint8Array(uint8Array:Uint8Array, littleEndian = false) {
    if (uint8Array.length < 8) {
        throw new Error("Uint8Array must be at least 8 bytes long");
    }

    let result = 0n; // BigInt initialization
    if (littleEndian) {
        for (let i = 7; i >= 0; i--) {
            result = (result << 8n) | BigInt(uint8Array[i]);
        }
    } else {
        for (let i = 0; i < 8; i++) {
            result = (result << 8n) | BigInt(uint8Array[i]);
        }
    }

    return result;
}