import { useState } from 'react';

const useLetterApi = () => {
    const [letter,setLetter] = useState<any>(null)
    const getLetter = async (letterId : number) => {

    }
    return {letter,getLetter}
}

export default useLetterApi;