import React, {useEffect, useState} from "react";
import {Minus, Plus} from "lucide-react";
import {MOBILE_MAX_ZOOM, MOBILE_MIN_ZOOM} from "../constants/constant.ts";
import {useScale} from "../hooks/ScaleContext.tsx";

interface MobileZoomControllerProp {
    isPlus: boolean
}

const MobileZoomController:React.FC<MobileZoomControllerProp> = ({isPlus}) => {
    const [isVisible, setIsVisible] = useState(true);
    const {scale, setScale} = useScale();
    const zoomUnit = 0.5;

    const handleClick = async () => {
        setScale(isPlus ?
            Math.min(scale + zoomUnit, MOBILE_MAX_ZOOM) :
            Math.max(scale - zoomUnit, MOBILE_MIN_ZOOM));
    };

    useEffect(() => {
        if ((scale === MOBILE_MIN_ZOOM && !isPlus) || (scale === MOBILE_MAX_ZOOM && isPlus)) {
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
                <Plus size={10} radius={10} strokeWidth={6}/> :
                <Minus size={10} strokeWidth={6}/>}
        </button>
    );
}

export default MobileZoomController;