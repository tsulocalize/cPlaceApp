import {useState, useEffect, useRef} from "react";
import pauseImg from "../assets/pause.png";
import stopImg from "../assets/stop.png";
import playImg from "../assets/play.png";

interface SeekBarProps {
    posPercent: number,
    setPosPercent: (value: (((prevState: number) => number) | number)) => void
}

function SeekBar({posPercent, setPosPercent}: SeekBarProps) {
    const [isDragging, setIsDragging] = useState(false);
    const handleRadius = 12; // 동그라미의 반지름 (4px 또는 5px일 때)
    const [position, setPosition] = useState(-handleRadius);
    const handleRef = useRef<HTMLDivElement>(null); // 동그라미 참조
    const [img, setImg] = useState(playImg);
    const isRunning = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // setInterval 저장

    useEffect(() => {
        setPosPercent((position + handleRadius) / 500 * 100);
    }, [position]);

    const handleMouseDown = (event: React.MouseEvent) => {
        setIsDragging(true);
        event.preventDefault(); // 드래그 중 다른 이벤트가 발생하지 않도록 방지
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging) return;
        const bar = document.querySelector(".seek-bar") as HTMLDivElement;
        const rect = bar.getBoundingClientRect();
        let newPosition = event.clientX - rect.left - handleRadius;

        // 바의 범위를 벗어나지 않도록 제한 (동그라미 크기 반영)
        newPosition = Math.max(-handleRadius, Math.min(newPosition, rect.width - handleRadius));

        setPosition(newPosition);
    };

    const playPause = () => {
        if (isRunning.current) {
            // 멈추기
            isRunning.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current); // 타이머 정리
                intervalRef.current = null;
            }
        } else {
            // 시작하기
            isRunning.current = true;
            intervalRef.current = setInterval(() => {
                // 현재 위치가 500 - handleRadius에 도달하면 멈추기
                setPosition((prev) => {
                    const newPosition = Math.min(500 - handleRadius, prev + 0.5);
                    if (newPosition >= 500 - handleRadius) {
                        clearInterval(intervalRef.current!); // 타이머 정리
                        intervalRef.current = null;
                        isRunning.current = false;
                    }
                    return newPosition;
                });
            }, 25);
        }
    };

    useEffect(() => {
        if (position === 500 - handleRadius) {
            setImg(stopImg);
        }
    }, [position]);

    const onClick = () => {
        if (img === stopImg) {
            setImg(playImg);
            setPosition(-handleRadius);
            return;
        }

        setImg((prev) => prev === pauseImg ? playImg : pauseImg);
        playPause();
    }

    // 마우스가 바 밖에서도 드래그 가능하도록 eventListener 추가
    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    return (

        <div className="fixed bottom-[10%]">
            <div
                className="left-1/4 -translate-x-11 translate-y-2 w-6 h-6 bg-white flex justify-center items-center rounded-full">
                <img src={img} alt="" onClick={onClick} className="w-6 h-6 cursor-pointer"></img>
            </div>
            <div
                className="seek-bar fixed bottom-[10%] left-1/2 -translate-x-1/2 w-[500px] h-2 bg-gray-300 rounded-full"
            >
                <div
                    ref={handleRef}
                    className={`absolute top-1/2 -translate-y-1/2 
                        ${isDragging ? "w-6 h-6" : "w-5 h-5"}`}
                    style={{
                        left: `${position}px`,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #d1d1d1 40%, #444444 100%)", // 동심원 형태
                        boxShadow: isDragging
                            ? "0 4px 6px rgba(0, 0, 0, 0.2)"
                            : "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseDown={handleMouseDown}
                />
                <div
                    className={`absolute top-1/2 translate-y-3 -translate-x-1.5`}
                    style={{
                        left: `${position}px`,
                    }}
                >
                    {posPercent.toFixed(1)}%
                </div>
            </div>
        </div>
    );
}

export default SeekBar;
