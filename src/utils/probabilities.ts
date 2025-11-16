import { GameState } from '../types';

export interface CardProbability {
  cardId: string;
  cardName: string;
  type: string;
  probabilities: {
    playerId: string;
    playerName: string;
    probability: number;
    isKnown: boolean;
  }[];
  envelopeProbability: number;
}

export function calculateProbabilities(gameState: GameState): CardProbability[] {
  const { players, cards, myCards, guesses, knowledge } = gameState;

  const results: CardProbability[] = [];

  for (const card of cards) {
    // Skip cards I have - I know I have them
    if (myCards.includes(card.id)) {
      const me = players.find(p => p.isMe);
      results.push({
        cardId: card.id,
        cardName: card.name,
        type: card.type,
        probabilities: players.map(p => ({
          playerId: p.id,
          playerName: p.name,
          probability: p.id === me?.id ? 1 : 0,
          isKnown: p.id === me?.id,
        })),
        envelopeProbability: 0,
      });
      continue;
    }

    // Get known information about this card
    const cardKnowledge = knowledge.filter(k => k.cardId === card.id);
    const knownOwner = cardKnowledge.find(k => k.isKnown);

    if (knownOwner) {
      // We know who has this card
      results.push({
        cardId: card.id,
        cardName: card.name,
        type: card.type,
        probabilities: players.map(p => ({
          playerId: p.id,
          playerName: p.name,
          probability: p.id === knownOwner.playerId ? 1 : 0,
          isKnown: true,
        })),
        envelopeProbability: knownOwner.playerId === null ? 1 : 0,
      });
      continue;
    }

    // Calculate probabilities based on what we know
    const impossiblePlayers = new Set<string>();
    const possiblePlayers = new Set<string>(players.map(p => p.id));

    // Process guesses to eliminate possibilities
    for (const guess of guesses) {
      const guessCards = [guess.suspect, guess.location, guess.weapon];

      if (guessCards.includes(card.id)) {
        // Players who passed don't have this card
        for (const playerId of guess.noCards) {
          impossiblePlayers.add(playerId);
          possiblePlayers.delete(playerId);
        }

        // If someone showed a card but we don't know which one,
        // they might have this card
        if (guess.shown && !guess.shown.cardId) {
          // Only this player could have one of the three cards
          // Keep them in possible players
        }

        // If we know which card was shown and it's not this one,
        // the showing player might still have this card
        if (guess.shown && guess.shown.cardId && guess.shown.cardId !== card.id) {
          // No new information about this specific card
        }

        // If we know this card was shown
        if (guess.shown && guess.shown.cardId === card.id) {
          // We know who has it
          const owner = guess.shown.playerId;
          results.push({
            cardId: card.id,
            cardName: card.name,
            type: card.type,
            probabilities: players.map(p => ({
              playerId: p.id,
              playerName: p.name,
              probability: p.id === owner ? 1 : 0,
              isKnown: true,
            })),
            envelopeProbability: 0,
          });
          continue;
        }
      }
    }

    // Calculate equal probability among remaining possible players + envelope
    const possibleCount = possiblePlayers.size + 1; // +1 for envelope
    const equalProbability = possibleCount > 0 ? 1 / possibleCount : 0;

    results.push({
      cardId: card.id,
      cardName: card.name,
      type: card.type,
      probabilities: players.map(p => ({
        playerId: p.id,
        playerName: p.name,
        probability: possiblePlayers.has(p.id) ? equalProbability : 0,
        isKnown: false,
      })),
      envelopeProbability: equalProbability,
    });
  }

  return results;
}

export function getSolutionProbabilities(gameState: GameState): {
  suspect: CardProbability[];
  location: CardProbability[];
  weapon: CardProbability[];
} {
  const probabilities = calculateProbabilities(gameState);

  return {
    suspect: probabilities
      .filter(p => p.type === 'suspect')
      .sort((a, b) => b.envelopeProbability - a.envelopeProbability),
    location: probabilities
      .filter(p => p.type === 'location')
      .sort((a, b) => b.envelopeProbability - a.envelopeProbability),
    weapon: probabilities
      .filter(p => p.type === 'weapon')
      .sort((a, b) => b.envelopeProbability - a.envelopeProbability),
  };
}
