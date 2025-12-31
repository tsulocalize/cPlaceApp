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

    const handleClickDiscord = () => {
        window.open("https://discord.gg/48J5u2NVwK", "_blank");
    };

    return (
        <div className="flex items-center justify-center font-sans fixed top-[2%] right-1 bg-transparent text-blue-100 px-3 py-1 text-md font-semibold w-[13%] min-w-[160px] max-w-full h-[5%] whitespace-pre gap-2">
            {`현재 접속자 수: ${count}`}
            <img
              src="/discord.png"
              alt="클릭 시 이동"
              onClick={handleClickDiscord}
              style={{ width: '20px', cursor: 'pointer' }}
            />
        </div>
    );
}

export default UserCounter;
