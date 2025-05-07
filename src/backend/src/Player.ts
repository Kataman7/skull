import Board from './Board';
import { ActionType, CardType } from './Types';
import Character from './Character';

class Player {
  id: string;
  name: string;
  hand: CardType[];
  deck: CardType[];
  point: number;
  skip: boolean = false;
  character: Character;
  isDead: boolean = false;


  constructor(id: string, name: string, character: Character) {
    this.id = id;
    this.name = name;
    this.hand = [CardType.Flower, CardType.Flower, CardType.Flower, CardType.Skull];
    this.deck = [];
    this.point = 0;
    this.character = character;
  }

  isPlayerTurn(): boolean {
    return Board.currentTurn === Board.players.indexOf(this);
  }

  playCard(handIndex: number): void {

    if (Board.players.length < 2)
      throw new Error('Not enough players to play.');

    if (Board.lastAction === ActionType.GameOver)
      throw new Error('Game is over.');

    if (Board.betValue > 0)
      throw new Error('You cannot play a card after betting.');

    if (handIndex < 0 || handIndex >= this.hand.length)
      throw new Error('Invalid hand index.');

    if (!this.isPlayerTurn())
      throw new Error('Not your turn to play.');

    this.deck.push(this.hand[handIndex]);
    this.hand.splice(handIndex, 1);
    Board.setLastAction(ActionType.PlayCard);
  }

  bet(betValue: number): boolean {
    
    if (!Number.isInteger(betValue))
      throw new Error('Bet value must be an integer.');

    if (!this.isPlayerTurn())
      throw new Error('Not your turn to play.');

    if (betValue > Board.computeBetMaxValue())
      throw new Error('Bet value exceeds maximum bet.');

    if (Board.betPlayer && Board.betPlayer.name === this.name)
      throw new Error('You must draw a card.');

    if (betValue > Board.betValue) {
      Board.betValue = betValue;
      Board.betPlayer = this;
      Board.setLastAction(ActionType.Bet);
      return true;
    }
    return false;
  }

  looseCard(): void {
    this.hand.push(...this.deck);
    this.deck = [];

    if (this.hand.length === 0)
      throw new Error('No card to loose');

    const randomIndex = Math.floor(Math.random() * this.hand.length);
    this.hand.splice(randomIndex, 1);
    Board.setLastAction(ActionType.LooseCard);
    Board.resetPlayersSkip();

    if (this.hand.length === 0) {
      this.isDead = true;
    }
  }

  recoveringDeck(): void {
    this.hand.push(...this.deck);
    this.deck = [];
  }

  pick(playerName: string): boolean {
    if (!this.isPlayerTurn())
      throw new Error('Not your turn to play');

    if (Board.betPlayer?.name !== this.name)
      throw new Error('Not your turn to pick');

    const player = Board.players.find(p => p.name === playerName);
    if (!player)
      throw new Error('Player not found');

    if (player.name !== this.name && this.deck.length > 0)
      throw new Error('First pick a card from your own deck');

    const pickedCard = player.deck.pop();
    if (!pickedCard)
      throw new Error('No card to pick');
    player.hand.push(pickedCard);

    if (pickedCard === CardType.Flower) {
      Board.betValue -= 1;
      Board.setLastAction(ActionType.Pick);
      return true;
    }
    else {
      this.looseCard();
      Board.betPlayer = null;
      Board.currentTurn -= 1;
      Board.betValue = 0;
      Board.resetPlayersSkip();

      Board.players.forEach(player => {
        player.recoveringDeck();
      });

      return false;
    }
  }
}

export default Player;