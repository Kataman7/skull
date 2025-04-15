import { useSelector } from 'react-redux';
import AtmList from '../atoms/AtmList';

const MolLogs = () => {
  const messages = useSelector((state) => state.logs.messages);
 
  return (
    <AtmList label='Logs' emptyMsg='no players found' items={messages}  />
  );
};

export default MolLogs;