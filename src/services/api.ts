import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 백엔드 서버 주소
    withCredentials: true, // 쿠키 포함 설정
});

export const updatePixel = async (x: number, y: number, color: string): Promise<boolean> => {
    return await api.post('/pixels', { x, y, color })
        .then((response) => {
            return response.status === 204;
        })
        .catch((error) => {
            if (error.response && error.response.data) {
                alert(`에러 코드 : ${error.response.data.code} \n원인: ${error.response.data.message}`);
            } else {
                alert('알 수 없는 에러가 발생했습니다.');
            }
            return false;
    });
};

export const login = async (code: string, state: string) => {
    await api.post('/login', { code, state })
        .catch((error) => {
            if (error.response && error.response.data) {
                alert(`에러 코드 : ${error.response.data.code} \n원인: ${error.response.data.message}`);
            } else {
                alert('알 수 없는 에러가 발생했습니다.');
            }
        });
};

export const tokenLogin = async (): Promise<boolean> => {
    try {
        const response = await api.post('/token-login');
        return response.status === 200;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false; // 네트워크 오류 또는 다른 에러 발생 시 인증 실패 처리
    }
};