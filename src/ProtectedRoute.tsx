import React, {useEffect} from "react";
import {tokenLogin} from "./services/api.ts";

interface ProtectedRouteProp {
    children: React.ReactNode
    isAuthenticated: boolean,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const ProtectedRoute:React.FC<ProtectedRouteProp> = ({children, isAuthenticated, setIsAuthenticated}) => {
    const redirectUri = import.meta.env.VITE_REDIRECT;
    const clientId = import.meta.env.VITE_CLIENT_ID;

    const url =
        `https://chzzk.naver.com/account-interlock?clientId=${clientId}&redirectUri=${redirectUri}&state=zxclDasdfA25`;

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated) {
                return;
            }

            const authenticated = await tokenLogin();
            if (authenticated) {
                setIsAuthenticated(true); // 인증된 상태
            } else {
                setIsAuthenticated(false); // 인증 실패
                window.location.href = url;
            }
        }

        checkAuth();
    }, []);

    return isAuthenticated ? children : null;
}

export default ProtectedRoute;