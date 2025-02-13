import './Home.css'
import ColorPalette from "./components/ColorPalette.tsx";
import {useEffect, useState} from "react";
import {useWebSocket} from "./hooks/useWebSocket.ts";
import {getPixels, updatePixel} from "./services/api.ts";
import Frame from "./components/Frame.tsx";
import CoordinateDisplay from "./components/CoordinateDisplay.tsx";
import {usePixelPosition} from "./hooks/PixelPositionContext.tsx";
import {ZoomProvider} from "./hooks/ZoomContext.tsx";
import TimerButton from "./components/TimerButton.tsx";
import {Color} from "./constants/colors.ts";

interface Pixel {
    x: number;
    y: number;
    color: string;
}

function Home() {
    const [pixels, setPixels] = useState<Map<string, string>>(new Map());
    const [selectedColor, setSelectedColor] = useState(Color.BLACK);
    const {pixelPosition} = usePixelPosition();

    // 초기 데이터 로드
    useEffect(() => {
        const fetchPixels = async () => {
            const pixelData = await getPixels(); // 백엔드에서 픽셀 데이터 가져오기
            const pixelMap = new Map<string, string>(pixelData.map((p: { x: number; y: number; color: string }) => [`${p.x},${p.y}`, p.color]));
            setPixels(pixelMap);
        };
        fetchPixels();
    }, []);

    // WebSocket 연결하고, 변경된 픽셀을 받아서 업데이트
    const handlePixelUpdate = (pixels: Pixel[]) => {
        requestAnimationFrame(() =>
            setPixels((prev) => {
                const map = new Map(prev);
                pixels.forEach((pixel) => map.set(`${pixel.x},${pixel.y}`, pixel.color));
                return map;
        }));
    };

    // WebSocket 훅 사용
    useWebSocket(handlePixelUpdate);

    const handleColorSelect = (color: string) => {
        setSelectedColor(color); // 색상 변경
    };

    const updateColor = async () => {
        return await updatePixel(pixelPosition?.x, pixelPosition?.y, selectedColor);
    }

    return (
        <div className="flex">
            <ZoomProvider>
                <CoordinateDisplay/>
                <div className="fixed left-0 top-0 flex-col items-start h-screen z-50">
                    <div className="absolute">
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