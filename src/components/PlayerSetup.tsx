import { useState } from 'react';
import { Player } from '../types';
import './PlayerSetup.css';

interface Props {
  onComplete: (players: Player[]) => void;
}

export default function PlayerSetup({ onComplete }: Props) {
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);
  const [myPlayerIndex, setMyPlayerIndex] = useState<number>(0);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill('').map((_, i) => playerNames[i] || ''));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = () => {
    const players: Player[] = playerNames.map((name, index) => {
      // Calculate card count based on total players
      // Standard Clue has 21 cards total, minus 3 in envelope = 18 cards
      const totalCards = 18;
      const baseCards = Math.floor(totalCards / playerCount);
      const extraCards = totalCards % playerCount;
      const cardCount = baseCards + (index < extraCards ? 1 : 0);

      return {
        id: crypto.randomUUID(),
        name: name || `Player ${index + 1}`,
        cardCount,
        isMe: index === myPlayerIndex,
      };
    });

    onComplete(players);
  };

  const isValid = playerNames.some(name => name.trim() !== '');

  return (
    <div className="card player-setup">
      <h2>Game Setup</h2>

      <div className="form-group">
        <label>Number of Players</label>
        <select
          value={playerCount}
          onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
        >
          {[3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} Players</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Player Names</label>
        {Array.from({ length: playerCount }).map((_, index) => (
          <div key={index} className="player-input">
            <input
              type="text"
              placeholder={`Player ${index + 1}`}
              value={playerNames[index] || ''}
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
            <label className="radio-label">
              <input
                type="radio"
                name="myPlayer"
                checked={myPlayerIndex === index}
                onChange={() => setMyPlayerIndex(index)}
              />
              <span>Me</span>
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={!isValid}>
        Continue to Card Selection
      </button>
    </div>
  );
}
