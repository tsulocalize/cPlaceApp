import CanvasContainer from "./CanvasContainer.tsx";
import React from "react";

interface FrameProps {
    selectedColor: string;
}

const Frame:React.FC<FrameProps> = ({selectedColor}) => {

    return (
        <div style={{
            display: "absolute",
            overflow: "hidden",
            border: "1px solid black"
        }}
             >
            <CanvasContainer selectedColor={selectedColor}/>
        </div>

    )
}

export default Frame;
