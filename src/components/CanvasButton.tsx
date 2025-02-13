import React, {MouseEventHandler} from "react";

interface CanvasButtonProps {
    size:number;
    mark:string;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const CanvasButton:React.FC<CanvasButtonProps> = ({size, mark, onClick}) => {
    return (
    <button
        className="text-black border-0 bg-transparent p-0"
        style={{
                fontSize: size,
                outline: 'none', // 포커스 링 제거
                boxShadow: 'none', // 클릭 시 동그라미 효과 제거
            }}
            onClick={onClick}
        >{mark}</button>
    );
}

export default CanvasButton;