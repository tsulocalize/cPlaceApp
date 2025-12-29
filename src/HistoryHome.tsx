import './Home.css'
import {useEffect, useState} from "react";
import {ZoomProvider} from "./hooks/ZoomContext.tsx";
import CoordinateDisplay from "./components/CoordinateDisplay.tsx";
import {Color} from "./constants/colors.ts";
import Frame from "./components/Frame.tsx";
import SeekBar from "./components/SeekBar.tsx";
import {getMapHistory} from "./services/api.ts";
import {useInitialize} from "./hooks/useInitailize.ts";

function HistoryHome() {
    const [selectedColor] = useState(Color.NONE);
    const [posPercent, setPosPercent] = useState(0);
    const [pixelMaps, setPixelMaps] = useState<Uint8Array[]>([]);
    const [currentMap, setCurrentMap] = useState<Uint8Array | null>(null);
    const { drawMap } = useInitialize();

    useEffect(() => {
        const fetchMap = async () => {
            const maps = await getMapHistory();
            setPixelMaps(maps);
        }
        fetchMap();
    }, []);

    useEffect(() => {
        if (pixelMaps.length === 0) return;
        const index = Math.min(
          Math.floor(pixelMaps.length * posPercent / 100),
          pixelMaps.length - 1
        );
        console.log(index);
        setCurrentMap(pixelMaps[index]);
    }, [pixelMaps, posPercent]);

    useEffect(() => {
        if (!currentMap) return;
        drawMap(currentMap, 8);
    }, [currentMap, drawMap]);

    return (
        <div className="flex">
            <ZoomProvider>
                <CoordinateDisplay/>
                <Frame selectedColor={selectedColor}/>
                <SeekBar posPercent={posPercent} setPosPercent={setPosPercent}/>
            </ZoomProvider>
        </div>
    );
}

export default HistoryHome;



