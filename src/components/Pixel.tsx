import React, { useState } from "react";

interface PixelProps {
    defaultColor: string;
    selectedColor: string;
}

const Pixel: React.FC<PixelProps> = ({ defaultColor, selectedColor }) => {
    const [color, setColor] = useState(defaultColor);
    const [hovered, setHovered] = useState(false); // 마우스 오버 상태 관리

    const handleClick = () => {
        setColor(selectedColor); // 클릭 시 색상 변경
    };

    return (
        <div
            className={`border ${hovered ? 'border-black' : 'border-gray-300'} cursor-pointer`} // 마우스 오버 시 검은색 테두리
            style={{
                width: "10px",
                height: "10px",
                backgroundColor: color,
            }}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)} // 마우스가 픽셀 위에 올려졌을 때
            onMouseLeave={() => setHovered(false)} // 마우스가 픽셀을 떠났을 때
        ></div>
    );
};

export default Pixel;
