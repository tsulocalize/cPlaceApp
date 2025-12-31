import {useEffect, useState} from "react";
import {getUserCount} from "../services/api.ts";

function UserCounter() {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchUserCount = async () => {
            const userCount = await getUserCount();
            if (userCount === null) {
                clearInterval(intervalId);
            } else {
                setCount(userCount)
            }
        }

        const intervalId = setInterval(fetchUserCount, 5000);
        fetchUserCount();

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex items-center justify-center font-sans fixed top-[2%] right-1 bg-transparent text-blue-100 px-3 py-1 text-md font-semibold w-[13%] min-w-[160px] max-w-full h-[5%] whitespace-pre">
            {`현재 접속자 수: ${count}`}
        </div>
    );
}

export default UserCounter;
