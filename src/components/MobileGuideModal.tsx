import { useState, useEffect } from "react";
import guide1 from "../assets/guide1.webp";
import guide2 from "../assets/guide2.webp";
import guide3 from "../assets/guide3.webp";

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const steps = [
    { title: "c/place에 오신 걸 환영합니다!",
        text: (
            <>
                3분에 한 번, 한 픽셀 색깔을 바꿀 수 있습니다. <br />
                비좁은 캔버스 안에서 그림을 완성하고, 영역을 늘리세요!
            </>
        ),
        image: guide1 },
    { title: "아래 규칙을 잘 지켜주세요",
        text: (
            <>
            <span className="text-lg">
                <strong>✅ 허용되는 것</strong> <br/>
            </span>
                - 협력해서 그림 지켜내기 <br/>
                - 다른 그림 영역 침범하기 <br/>
                <br/>
            <span className="text-lg">
                <strong>🚫 허용되지 않는 것</strong> <br/>
            </span>
                - 다른 유저에게 불쾌감을 줄 수 있는 그림 <br/>
                - 실존 인물에 대한 모욕, 비방, 명예훼손에 준하는 그림
                {"\n"}
                {"\n"}
            </>
            ),
            image: guide2 },
            {title: "이제 다 됐습니다!",
                text: (
                <>
                    수많은 방해공작을 이겨내고 그림을 완성하세요!
                </>
                ),
                image: guide3},
            ];

export default function MobileGuideModal({isOpen, onClose}: GuideModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const guideSeen = localStorage.getItem("guide_seen");
        if (guideSeen === "true") {
            onClose();
        }
    }, [onClose]);

    // ✅ 이미지 미리 로드하기
    useEffect(() => {
        steps.forEach((step) => {
            const img = new Image();
            img.src = step.image;
        });
    }, []);

    const handleFinish = () => {
    if (dontShowAgain) {
        localStorage.setItem("guide_seen", "true");
        }
    onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
                <h2 className="font-bold mb-4 text-xl text-black">{steps[currentStep].title}</h2>
                <img src={steps[currentStep].image} alt={`Guide step ${currentStep + 1}`} className="mb-4 w-full h-auto rounded" />
                <p className="font-sans mb-4 text-left text-base text-black whitespace-pre-line">{steps[currentStep].text}</p>
                <div className="flex flex-col items-center">
                    {currentStep === steps.length - 1 && (
                        <label className="flex items-center text-black text-lg mb-4">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={dontShowAgain}
                                onChange={() => setDontShowAgain(!dontShowAgain)}
                            />
                            다시 보지 않을래요
                        </label>
                    )}
                    <div className="flex justify-between w-full">
                        {currentStep > 0 && (
                            <button
                                className="px-4 py-2 bg-gray-500 text-xl font-bold text-white rounded-md hover:bg-gray-600"
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                이전
                            </button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <button
                                className="px-4 py-2 bg-blue-500 text-xl font-bold text-white rounded-md hover:bg-blue-600 ml-auto"
                                onClick={() => setCurrentStep(currentStep + 1)}
                            >
                                다음
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 bg-green-500 font-bold text-xl text-white rounded-md hover:bg-green-600 ml-auto"
                                onClick={handleFinish}
                            >
                                그리기
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
