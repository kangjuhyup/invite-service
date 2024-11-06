import { useEffect } from "react";

interface InitProps {
    apis: Array<() => void>;
}

const useInit = ({ apis }: InitProps) => {
    useEffect(() => {
        apis.forEach((api) => {
            api();
        });
    }, []);
};

export default useInit;
