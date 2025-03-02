import React, {useEffect, useRef} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {login} from "./services/api.ts";

interface LoginRouteProp {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginRoute:React.FC<LoginRouteProp> = ({setIsAuthenticated}) => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const navigate = useNavigate();

    const isMobile = useRef<boolean>(false);

    useEffect(() => {
        if (window.matchMedia("(max-width: 768px)").matches) {
            isMobile.current = true;
        }
    }, []);

    useEffect(() => {
        if (code === null || state === null) return;
        login(code, state)
            .then(() => {
                setIsAuthenticated(true);
                if (isMobile) {
                    navigate("/mobile");
                } else {
                    navigate("/");
                }
            })

    }, []);

    return null;
};

export default LoginRoute;
