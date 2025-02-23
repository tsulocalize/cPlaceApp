import CanvasContainer from "./CanvasContainer.tsx";
import {Color} from "../constants/colors.ts";

interface pixelData {
    color: Color;
    timeStamp: number;
}

interface FrameProps {
    pixels: Map<string, pixelData>
    selectedColor: string;
}

const Frame:React.FC<FrameProps> = ({pixels, selectedColor}) => {

    return (
        <div style={{
            display: "absolute",
            overflow: "hidden",
            border: "1px solid black"
        }}
             >
            <CanvasContainer pixels={pixels} selectedColor={selectedColor}/>
        </div>

    )
}

export default Frame;
