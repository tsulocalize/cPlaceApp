import React, {useState, useEffect} from "react";
import {usePixelPosition} from "../hooks/PixelPositionContext.tsx";

interface TimerButtonProp {
    onClick: () => Promise<boolean>
    timeLimit: number
    selectedColor: string
}

const TimerButton:React.FC<TimerButtonProp> = ({onClick, timeLimit, selectedColor}) => {
    const [remainingTime, setRemainingTime] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false); // disabled 상태를 별도로 관리
    const {clicked, setClicked} = usePixelPosition();

    useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (remainingTime > 0) {
            setIsDisabled(true); // 타이머 시작 시 버튼 비활성화
            timerId = setTimeout(() => {
                setRemainingTime((prev) => prev - 1);
            }, 1000);
        } else {
            if (clicked) {
                setIsDisabled(false); // 타이머 끝나면 버튼 활성화
            }
        }

        return () => clearTimeout(timerId); // cleanup
    }, [remainingTime, clicked]);

    const handleClick = async () => {
        return onClick()
            .then((success:boolean) => {
                if (success) {
                    setRemainingTime(timeLimit);
                }
                setClicked(false);
            });
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    // HEX → RGB 변환 함수
    const hexToRgb = (hex: string) => {
        hex = hex.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
    };

    // 밝기(Luminance) 계산 함수
    const getLuminance = (hex: string) => {
        const { r, g, b } = hexToRgb(hex);
        return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    // 글씨 색상 결정 (128 기준으로 흰색 or 검은색)
    const textColor = getLuminance(selectedColor) > 128 ? "#000000" : "#FFFFFF";

    return (
        <button
            onClick={handleClick}
            disabled={isDisabled} // isDisabled 상태로 제어
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 w-[6.5rem] max-w-full rounded-lg ${isDisabled ? "bg-gray-400 cursor-not-allowed" : ""}`}
            style={{
                backgroundColor: selectedColor,
                color: textColor
            }}
        >
            {remainingTime > 0 ? formatTime(remainingTime) : "그리기"}
        </button>
    );
}

export default TimerButton;