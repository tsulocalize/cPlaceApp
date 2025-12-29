import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 백엔드 서버 주소
    withCredentials: true, // 쿠키 포함 설정
});

export const getPixels = async (): Promise<Uint8Array> => {
    return await api.get('/pixels', {responseType: "arraybuffer"})
        .then((response) => {
            return new Uint8Array(response.data);
        })
        .catch((error) => {
            if (error.response && error.response.data) {
                alert(`에러 코드 : ${error.response.data.code} \n원인: ${error.response.data.message}`);
            } else {
                alert('알 수 없는 에러가 발생했습니다.');
            }
            throw Error();
        });
};

export const getDirtySet = async (lastUpdated:bigint): Promise<Uint8Array> => {
    return await api.get(`/dirty-set?lastUpdated=${lastUpdated}`, {responseType: "arraybuffer"})
        .then((response) => {
            return new Uint8Array(response.data);
        })
        .catch((error) => {
            if (error.response && error.response.data) {
                alert(`에러 코드 : ${error.response.data.code} \n원인: ${error.response.data.message}`);
            } else {
                alert('알 수 없는 에러가 발생했습니다.');
            }
            throw Error();
        });
};

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

export const getMapHistory = async (): Promise<Uint8Array[]> => {
    try {
        const response = await api.get(`/map/history`, {
            responseType: "arraybuffer", // 중요!
        });
        const buffer = response.data as ArrayBuffer;
        return parsePixelMaps(buffer);
    } catch (e) {
        alert("히스토리 데이터를 가져오는데 실패했습니다.");
        throw e;
    }
};

const parsePixelMaps = (buffer: ArrayBuffer): Uint8Array[] => {
    const view = new DataView(buffer);
    let offset = 0;

    // map 개수
    const mapCount = view.getInt32(offset, false); // big-endian
    offset += 4;

    const maps: Uint8Array[] = [];

    for (let i = 0; i < mapCount; i++) {
        // map 길이
        const length = view.getInt32(offset, false);
        offset += 4;

        // map 데이터
        const map = new Uint8Array(buffer, offset, length);
        maps.push(map);

        offset += length;
    }

    return maps;
};

export const getUserCount = async (): Promise<number> => {
    return await api.get('/current-user')
      .then((response) => {
          return response.data;
      })
      .catch((error) => {
          if (error.response && error.response.data) {
              alert(`에러 코드 : ${error.response.data.code} \n원인: ${error.response.data.message}`);
          } else {
              alert('알 수 없는 에러가 발생했습니다.');
          }
          return false;
      });
}
