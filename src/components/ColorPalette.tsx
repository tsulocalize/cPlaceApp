import React from "react";
import {Color, PALETTE_COLORS} from "../constants/colors.ts";

interface ColorPaletteProps {
    onSelectColor: (color: Color) => void;
    selectedColor: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ onSelectColor, selectedColor }) => {
    return (
        <div className="flex flex-col min-w-[60px] h-screen w-full items-center justify-between overflow-y-auto bg-gray-200 p-2">
            {PALETTE_COLORS.map((color) => (
                <div
                    key={color}
                    className={`min-w-[40px] w-[80%] h-[4.5%] cursor-pointer ${selectedColor === color ? 'border-2' : ''}`}
                    style={{
                        backgroundColor: color,
                        borderColor: selectedColor !== color
                            ? "transparent"
                            : color === Color.BLACK
                                ? "white"
                                : "black", // 검은색일 때만 흰색 테두리, 그 외는 선택된 색으로 테두리
                    }}
                    onClick={() => onSelectColor(color)}
                ></div>
            ))}
        </div>
    );
};

export default ColorPalette;
