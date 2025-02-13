import CanvasContainer from "./CanvasContainer.tsx";

interface FrameProps {
    pixels: Map<string, string>
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
