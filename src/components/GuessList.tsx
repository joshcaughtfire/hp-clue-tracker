import { Guess, GameState } from '../types';
import { ALL_CARDS } from '../data/cards';
import './GuessList.css';

interface Props {
  guesses: Guess[];
  gameState: GameState;
}

export default function GuessList({ guesses, gameState }: Props) {
  if (guesses.length === 0) {
    return (
      <div className="card guesses-list">
        <h2>Guess History</h2>
        <p className="empty-state">No guesses recorded yet. Add your first guess above!</p>
      </div>
    );
  }

  const getCardName = (cardId: string) => {
    return ALL_CARDS.find(c => c.id === cardId)?.name || cardId;
  };

  const getPlayerName = (playerId: string) => {
    return gameState.players.find(p => p.id === playerId)?.name || playerId;
  };

  // Sort guesses by most recent first
  const sortedGuesses = [...guesses].reverse();

  return (
    <div className="card guesses-list">
      <h2>Guess History ({guesses.length})</h2>
      <div className="guesses">
        {sortedGuesses.map(guess => (
          <div key={guess.id} className="guess-item">
            <div className="guess-header">
              <span className="round">Round {guess.round}</span>
              <span className="guesser">{getPlayerName(guess.guesser)}</span>
            </div>
            <div className="guess-cards">
              <span className="suspect">{getCardName(guess.suspect)}</span>
              <span className="divider">•</span>
              <span className="location">{getCardName(guess.location)}</span>
              <span className="divider">•</span>
              <span className="weapon">{getCardName(guess.weapon)}</span>
            </div>
            <div className="guess-result">
              {guess.shown ? (
                <div className="shown">
                  <span className="label">Shown by:</span>
                  <span className="player">{getPlayerName(guess.shown.playerId)}</span>
                  {guess.shown.cardId && (
                    <span className="card">({getCardName(guess.shown.cardId)})</span>
                  )}
                </div>
              ) : (
                <div className="no-show">All players passed</div>
              )}
              {guess.noCards.length > 0 && (
                <div className="passed">
                  <span className="label">Passed:</span>
                  <span className="players">
                    {guess.noCards.map(pid => getPlayerName(pid)).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
