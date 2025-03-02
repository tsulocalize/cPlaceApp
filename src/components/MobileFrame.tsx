import React from "react";
import MobileCanvasContainer from "./MobileCanvasContainer.tsx";

interface FrameProps {
    selectedColor: string;
}

const MobileFrame:React.FC<FrameProps> = ({selectedColor}) => {

    return (
        <div style={{
            display: "absolute",
            overflow: "hidden",
            border: "1px solid black"
        }}
             >
            <MobileCanvasContainer selectedColor={selectedColor}/>
        </div>

    )
}

export default MobileFrame;
