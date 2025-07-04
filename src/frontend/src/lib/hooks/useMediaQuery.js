import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        setMatches(mediaQueryList.matches);

        const listener = (event) => {
            setMatches(event.matches);
        };

        mediaQueryList.addEventListener('change', listener);
        return () => mediaQueryList.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

export default useMediaQuery;