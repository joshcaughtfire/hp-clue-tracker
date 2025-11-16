export type CardType = 'suspect' | 'location' | 'weapon';

export interface Card {
  id: string;
  name: string;
  type: CardType;
}

export interface Player {
  id: string;
  name: string;
  cardCount: number;
  isMe: boolean;
}

export interface CardKnowledge {
  cardId: string;
  playerId: string | null; // null means it's in the envelope
  isKnown: boolean; // true if we know for certain
  isPossible: boolean; // true if it's possible this player has it
}

export interface Guess {
  id: string;
  round: number;
  guesser: string; // player id
  suspect: string; // card id
  location: string; // card id
  weapon: string; // card id
  shown: {
    playerId: string;
    cardId?: string; // if we know which card was shown
  } | null;
  noCards: string[]; // player ids who passed (don't have any of the three cards)
  timestamp: Date;
}

export interface GameState {
  players: Player[];
  cards: Card[];
  myCards: string[]; // card ids that I have
  guesses: Guess[];
  knowledge: CardKnowledge[];
  solution: {
    suspect: string | null;
    location: string | null;
    weapon: string | null;
  };
}
