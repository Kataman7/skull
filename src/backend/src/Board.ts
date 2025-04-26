import Character, { CharacterFactory } from "./Character";
import Player from "./Player";
import { ActionType } from "./Types";

class Board {
    static players: Player[] = [];
    static currentTurn: number = 0;
    static betValue: number = 0;
    static betPlayer: Player | null = null;
    static lastAction: ActionType | null = null;
    static winner: Player | null = null;

    static characters: Character[] = CharacterFactory();

    static removeRandomCharacter(): Character | null {
        if (this.characters.length === 0) {
            return null
        }
        const randomIndex = Math.floor(Math.random() * this.characters.length);
        const character = this.characters[randomIndex];
        this.characters.splice(randomIndex, 1);
        return character;
    }

    static computeBetMaxValue(): number {
        let maxBet = 0;
        for (const player of Board.players) {
            maxBet += player.deck.length;
        }
        return maxBet;
    }

    static addPlayer(player: Player): void {
        if (Board.players.find(p => p.name === player.name)) {
            throw new Error('Player already exists');
        }

        Board.players.push(player);
        Board.lastAction = ActionType.Join;
    }

    static isGameOver(): boolean {

        if (this.players.length < 2) return true

        if (this.betValue === 0 && this.betPlayer !== null) {
            if (this.betPlayer.point > 0) return true

            this.betPlayer.point++
            this.betPlayer = null
            this.resetPlayersSkip()
            this.players.forEach(player => {
                player.recoveringDeck()
            });
            this.currentTurn--

        }
        return false
    }

    static resetBoard(): void {
        Board.players = [];
        Board.currentTurn = 0;
        Board.betValue = 0;
        Board.betPlayer = null;
        Board.lastAction = null;
        Board.winner = null;
    }


    static playTurn(): boolean {
        if (Board.players.length === 0) {
            throw new Error('No players in the game.');
        }

        if (Board.isGameOver()) {
            const winner = this.players.length < 2 ? this.players[0] : this.betPlayer;
            this.resetBoard();
            Board.lastAction = ActionType.GameOver;
            Board.winner = winner;
            return true;
        }
        else {
            if (this.betValue === this.computeBetMaxValue() && this.betPlayer) {
                do {
                    Board.currentTurn = (Board.currentTurn + 1) % Board.players.length;
                } while (Board.players[Board.currentTurn].name !== Board.betPlayer?.name);
            }
            else {
                do {
                    Board.currentTurn = (Board.currentTurn + 1) % Board.players.length;
                } while (Board.players[Board.currentTurn].skip);
            }
        }
        return false;
    }

    static getPublicData(): object {

        const datas = {
            players: Board.players.map(player => ({
                name: player.name,
                deck: player.deck.length,
                hand: player.hand.length,
                character: player.character.name,
                point: player.point,
                color: player.character.color,
            })),
            currentTurn: Board.currentTurn,
            betValue: Board.betValue,
            betPlayer: Board.betPlayer?.name || null,
            lastAction: Board.lastAction,
            winner: Board.winner?.name || null,
        }

        return datas;
    }

    static removePlayer(playerID: string): string {
        const playerIndex = Board.players.findIndex(player => player.id === playerID);
        if (playerIndex === -1) {
            throw new Error('Player not found');
        }

        // Vérifier si c'est le tour du joueur qui part
        const isCurrentPlayerLeaving = playerIndex === Board.currentTurn;

        // Si c'est le joueur betPlayer qui part
        if (Board.betPlayer?.id === playerID) {
            Board.betPlayer = null;
            Board.betValue = 0; // Réinitialiser la valeur du pari
        }

        const playerName = Board.players[playerIndex].name;
        Board.characters.push(Board.players[playerIndex].character);

        // Supprimer le joueur
        Board.players.splice(playerIndex, 1);

        // Gérer l'ajustement du tour après suppression
        if (Board.players.length === 0) {
            // S'il n'y a plus de joueurs, réinitialiser le tour
            Board.resetBoard();
        } else if (isCurrentPlayerLeaving) {
            // Si c'était le tour du joueur qui part, on ne change pas currentTurn
            // car le prochain joueur est maintenant à cet index
            // Mais on s'assure que currentTurn ne dépasse pas la taille du tableau
            if (Board.currentTurn >= Board.players.length) {
                Board.currentTurn = 0;
            }
        } else if (playerIndex < Board.currentTurn) {
            // Si le joueur supprimé était avant le joueur actuel, décaler l'index du tour
            Board.currentTurn--;
        }
        // Dans tous les autres cas, currentTurn reste inchangé

        Board.lastAction = ActionType.Leave;
        return playerName;
    }

    static resetPlayersSkip(): void {
        for (const player of Board.players) {
            player.skip = false;
        }
        this.betValue = 0;
    }
}

export default Board;