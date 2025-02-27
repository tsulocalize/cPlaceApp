import {PIXEL_HORIZONTAL_COUNT, PIXEL_VERTICAL_COUNT} from "../constants/constant.ts";
import {Color} from "../constants/colors.ts";
import {getGlobalCanvasRef} from "./usePixelQueue.ts";


export const useInitialize = () => {

    const drawMap = (buffer:Uint8Array, offset:number) => {
        const pixelData = new Uint8Array(PIXEL_HORIZONTAL_COUNT * PIXEL_VERTICAL_COUNT * 4);
        for (let i = offset; i < buffer.length; i++) {
            const [r, g, b, a] = hexToRGBA(Object.values(Color)[buffer[i]]);
            pixelData[(i - offset) * 4] = r;
            pixelData[(i - offset) * 4 + 1] = g;
            pixelData[(i - offset) * 4 + 2] = b;
            pixelData[(i - offset) * 4 + 3] = a;
        }

        const imageData = new ImageData(new Uint8ClampedArray(pixelData), PIXEL_HORIZONTAL_COUNT, PIXEL_VERTICAL_COUNT);
        getGlobalCanvasRef()?.putImageData(imageData, 0, 0);
    }

    const hexToRGBA = (hex: string): [number, number, number, number] => {
        hex = hex.replace("#", ""); // '#' 제거

        let r = 0, g = 0, b = 0, a = 255; // 기본 알파값 255 (불투명)

        if (hex.length === 6) { // #RRGGBB
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (hex.length === 8) { // #RRGGBBAA
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            a = parseInt(hex.substring(6, 8), 16);
        }

        return [r, g, b, a];
    };

    return { drawMap };
}