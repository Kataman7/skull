import AtmButton from "../atoms/AtmButton";
import { useSocketContext } from '../../lib/hooks/useSocketContext';
import { useEffect, useState } from "react";
import useIsMobile from "../../lib/hooks/useIsMobile";

const MolKickButton = () => {
    const { board, kickCurrentPlayer } = useSocketContext();
    const [isDisabled, setIsDisabled] = useState(true);
    const isMobile = useIsMobile();

    const handleClick = () => {
        if (!board) return;
        kickCurrentPlayer();
    };

    useEffect(() => {
        const checkDisabled = () => {
            if (!board || board.players.length === 0 || !board.lastDate) {
                setIsDisabled(true);
                return;
            }
            const last = typeof board.lastDate === 'string'
                ? new Date(board.lastDate).getTime()
                : board.lastDate.getTime();
            const now = Date.now();
            // Désactiver si moins d'1 minute s'est écoulée
            setIsDisabled(now - last < 60_000);
        };

        checkDisabled();
        const interval = setInterval(checkDisabled, 1_000);
        return () => clearInterval(interval);
    }, [board]);

    if (isMobile && isDisabled) return null;

    return (
        <AtmButton
            onClick={handleClick}
            label="Kick current player"
            disabled={isDisabled}    // <— on passe bien la prop `disabled`
        />
    );
}

export default MolKickButton;