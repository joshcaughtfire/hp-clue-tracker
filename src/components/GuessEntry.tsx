import { useState } from 'react';
import { Player, Card, Guess } from '../types';
import { SUSPECTS, LOCATIONS, WEAPONS } from '../data/cards';
import './GuessEntry.css';

interface Props {
  players: Player[];
  cards: Card[];
  onAddGuess: (guess: Omit<Guess, 'id' | 'round' | 'timestamp'>) => void;
}

export default function GuessEntry({ players, onAddGuess }: Props) {
  const [guesser, setGuesser] = useState(players[0]?.id || '');
  const [suspect, setSuspect] = useState(SUSPECTS[0]?.id || '');
  const [location, setLocation] = useState(LOCATIONS[0]?.id || '');
  const [weapon, setWeapon] = useState(WEAPONS[0]?.id || '');
  const [noCards, setNoCards] = useState<Set<string>>(new Set());
  const [showingPlayer, setShowingPlayer] = useState<string>('');
  const [shownCard, setShownCard] = useState<string>('');

  const handleNoCardToggle = (playerId: string) => {
    const newNoCards = new Set(noCards);
    if (newNoCards.has(playerId)) {
      newNoCards.delete(playerId);
    } else {
      newNoCards.add(playerId);
    }
    setNoCards(newNoCards);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const guess: Omit<Guess, 'id' | 'round' | 'timestamp'> = {
      guesser,
      suspect,
      location,
      weapon,
      shown: showingPlayer ? {
        playerId: showingPlayer,
        cardId: shownCard || undefined,
      } : null,
      noCards: Array.from(noCards),
    };

    onAddGuess(guess);

    // Reset form
    setNoCards(new Set());
    setShowingPlayer('');
    setShownCard('');
  };

  const guessedCards = [suspect, location, weapon];

  return (
    <div className="card guess-entry">
      <h2>Record a Guess</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Who Guessed?</label>
            <select value={guesser} onChange={(e) => setGuesser(e.target.value)}>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Suspect</label>
            <select value={suspect} onChange={(e) => setSuspect(e.target.value)}>
              {SUSPECTS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              {LOCATIONS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Weapon</label>
            <select value={weapon} onChange={(e) => setWeapon(e.target.value)}>
              {WEAPONS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Players with NO matching cards</label>
          <div className="player-chips">
            {players.filter(p => p.id !== guesser).map(player => (
              <button
                key={player.id}
                type="button"
                className={`chip ${noCards.has(player.id) ? 'active' : ''}`}
                onClick={() => handleNoCardToggle(player.id)}
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Who showed a card?</label>
          <select
            value={showingPlayer}
            onChange={(e) => {
              setShowingPlayer(e.target.value);
              setShownCard('');
            }}
          >
            <option value="">No one (all passed)</option>
            {players.filter(p => p.id !== guesser && !noCards.has(p.id)).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {showingPlayer && (
          <div className="form-group">
            <label>Which card was shown? (optional)</label>
            <select value={shownCard} onChange={(e) => setShownCard(e.target.value)}>
              <option value="">I don't know</option>
              {guessedCards.map(cardId => {
                const card = [suspect, location, weapon].includes(cardId)
                  ? [...SUSPECTS, ...LOCATIONS, ...WEAPONS].find(c => c.id === cardId)
                  : null;
                return card ? (
                  <option key={card.id} value={card.id}>{card.name}</option>
                ) : null;
              })}
            </select>
          </div>
        )}

        <button type="submit">Add Guess</button>
      </form>
    </div>
  );
}
