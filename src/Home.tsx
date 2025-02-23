import './Home.css'
import ColorPalette from "./components/ColorPalette.tsx";
import {useState} from "react";
import {useWebSocket} from "./hooks/useWebSocket.ts";
import {updatePixel} from "./services/api.ts";
import Frame from "./components/Frame.tsx";
import CoordinateDisplay from "./components/CoordinateDisplay.tsx";
import {usePixelPosition} from "./hooks/PixelPositionContext.tsx";
import {ZoomProvider} from "./hooks/ZoomContext.tsx";
import TimerButton from "./components/TimerButton.tsx";
import {Color} from "./constants/colors.ts";

interface PixelMedia {
    x: number;
    y: number;
    colorIndex: number;
    timeStamp: number;
}

interface pixelData {
    color: Color;
    timeStamp: number;
}

function Home() {
    const [pixels, setPixels] = useState<Map<string, pixelData>>(new Map());
    const [selectedColor, setSelectedColor] = useState(Color.BLACK);
    const {pixelPosition} = usePixelPosition();

    // WebSocket 연결하고, 변경된 픽셀을 받아서 업데이트
    const handlePixelUpdate = (pixelMedia: PixelMedia[]) => {
        requestAnimationFrame(() =>
            setPixels((prev) => {
                const map = new Map(prev);
                pixelMedia.forEach((pixel) => {
                    const prevData = map.get(`${pixel.x},${pixel.y}`);
                    if (!prevData || prevData.timeStamp < pixel.timeStamp) {
                        map.set(`${pixel.x},${pixel.y}`, { color: Object.values(Color)[pixel.colorIndex], timeStamp: pixel.timeStamp });
                    }
                });
                return map;
            }));
    };

    // WebSocket 훅 사용
    useWebSocket(handlePixelUpdate);

    const handleColorSelect = (color: Color) => {
        setSelectedColor(color); // 색상 변경
    };

    const updateColor = async () => {
        return await updatePixel(pixelPosition?.x, pixelPosition?.y, selectedColor);
    }

    return (
        <div className="flex">
            <ZoomProvider>
                <CoordinateDisplay/>
                <div className="fixed left-0 top-0 flex-col items-start h-screen z-40 w-[4%]">
                    <div className="absolute w-full">
                        <ColorPalette selectedColor={selectedColor} onSelectColor={handleColorSelect}/>
                    </div>
                </div>
                <Frame pixels={pixels} selectedColor={selectedColor}/>
                <TimerButton onClick = {updateColor} timeLimit = {5 * 60} selectedColor={selectedColor}/>
            </ZoomProvider>
        </div>
    );
}

export default Home;