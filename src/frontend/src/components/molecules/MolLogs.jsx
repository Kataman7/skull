import { useSelector } from 'react-redux';
import AtmList from '../atoms/AtmList';
import useIsMobile from '../../lib/hooks/useIsMobile';

const MolLogs = () => {
  const messages = useSelector((state) => state.logs.messages);
  const isMobile = useIsMobile();
 
  return (
    <AtmList label={isMobile ? '' : 'Logs'} emptyMsg='no players found' items={messages}  maxHeight={isMobile ? '95px' : '300px'}/>
  );
};

export default MolLogs;