import Board from "./Board";
import Player from "./Player";

class Utils {
    static getPlayerById(socketId: string): Player | null {
        return Board.players.find(p => p.id === socketId) || null;
    }
}

export default Utils;