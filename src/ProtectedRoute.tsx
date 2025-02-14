import React, {useEffect} from "react";
import {tokenLogin} from "./services/api.ts";

interface ProtectedRouteProp {
    children: React.ReactNode
    isAuthenticated: boolean,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const ProtectedRoute:React.FC<ProtectedRouteProp> = ({children, isAuthenticated, setIsAuthenticated}) => {
    const url = "https://chzzk.naver.com/account-interlock?clientId=88e1dfeb-71e1-45bf-b2ff-eb5179bc9d38&redirectUri=https://cplace.chz-on.me/login&state=zxclDasdfA25";

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