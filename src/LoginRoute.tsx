import React, {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {login, tokenLogin} from "./services/api.ts";

interface LoginRouteProp {
    isAuthenticated: boolean,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
}

const LoginRoute:React.FC<LoginRouteProp> = ({isAuthenticated, setIsAuthenticated}) => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const url = `https://chzzk.naver.com/account-interlock?clientId=${import.meta.env.VITE_CLIENT_ID}&redirectUri=${import.meta.env.VITE_REDIRECT}&state=${import.meta.env.VITE_STATE}`;

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated) {
                alert("이미 로그인 되어 있습니다.");
                return;
            }

            const authenticated = await tokenLogin();
            if (!authenticated) {
                if (code === null || state === null) {
                    window.location.href = url;
                    return;
                }

                login(code, state)
                    .then(() => {
                        window.history.replaceState({}, "", window.location.pathname);
                        setIsAuthenticated(true);
                    });
            } else {
                setIsAuthenticated(true); // 인증된 상태
            }
        }

        checkAuth();
    }, []);

    return null;
};

export default LoginRoute;
