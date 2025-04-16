import useMediaQuery from './useMediaQuery';

const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

export default useIsMobile;