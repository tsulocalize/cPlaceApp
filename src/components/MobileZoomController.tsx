import React, {useEffect, useState} from "react";
import {Minus, Plus} from "lucide-react";
import {MAX_ZOOM, MIN_ZOOM} from "../constants/constant.ts";
import {useScale} from "../hooks/ScaleContext.tsx";

interface MobileZoomControllerProp {
    isPlus: boolean
}

const MobileZoomController:React.FC<MobileZoomControllerProp> = ({isPlus}) => {
    const [isVisible, setIsVisible] = useState(true);
    const {scale, setScale} = useScale();
    const zoomUnit = 0.5;

    const handleClick = async () => {
        setScale(isPlus ? scale + zoomUnit : scale - zoomUnit);
    };

    useEffect(() => {
        if ((scale === MIN_ZOOM && !isPlus) || (scale === MAX_ZOOM && isPlus)) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [scale]);

    return (
        <button
            onClick={handleClick}
            disabled={!isVisible}
            className={`${isVisible ? "opacity-100" : "opacity-0"} flex items-center justify-center rounded-full bg-white text-black active:bg-green-500 transition`}
        >
            {isPlus ?
                <Plus size={24} strokeWidth={3}/> :
                <Minus size={24} strokeWidth={3}/>}
        </button>
    );
}

export default MobileZoomController;