import React, { useEffect } from "react";
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

    useEffect(() => {
        if (code === null || state === null) return;
        login(code, state)
            .then(() => {
                setIsAuthenticated(true);
                navigate("/");
            })

    }, []);

    return null;
};

export default LoginRoute;
