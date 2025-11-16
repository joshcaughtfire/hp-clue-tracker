import { useState } from 'react';
import { GameState } from '../types';
import { SUSPECTS, LOCATIONS, WEAPONS } from '../data/cards';
import { calculateProbabilities } from '../utils/probabilities';
import './CardGrid.css';

interface Props {
  gameState: GameState;
  onMarkCardKnown: (cardId: string, playerId: string | null) => void;
}

export default function CardGrid({ gameState, onMarkCardKnown }: Props) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const probabilities = calculateProbabilities(gameState);

  const getCardStatus = (cardId: string, playerId: string) => {
    // Check if I have this card
    if (gameState.myCards.includes(cardId)) {
      const me = gameState.players.find(p => p.isMe);
      return playerId === me?.id ? 'has' : 'not';
    }

    // Check known information
    const knowledge = gameState.knowledge.find(
      k => k.cardId === cardId && k.playerId === playerId
    );

    if (knowledge?.isKnown) {
      return knowledge.isPossible ? 'has' : 'not';
    }

    // Check probabilities
    const cardProb = probabilities.find(p => p.cardId === cardId);
    const playerProb = cardProb?.probabilities.find(p => p.playerId === playerId);

    if (playerProb?.probability === 0) {
      return 'not';
    }

    if (playerProb?.probability === 1) {
      return 'has';
    }

    return 'maybe';
  };

  const handleCellClick = (cardId: string, playerId: string | null) => {
    if (selectedCard === cardId) {
      // Mark this player as having the card
      onMarkCardKnown(cardId, playerId);
      setSelectedCard(null);
    } else {
      setSelectedCard(cardId);
    }
  };

  const renderCardSection = (title: string, cards: typeof SUSPECTS) => (
    <div className="card-section">
      <h3>{title}</h3>
      <div className="grid-table">
        <div className="grid-header">
          <div className="card-header">Card</div>
          {gameState.players.map(player => (
            <div key={player.id} className="player-header">
              {player.name}
            </div>
          ))}
          <div className="envelope-header">Envelope</div>
        </div>

        {cards.map(card => {
          const isSelected = selectedCard === card.id;
          const cardProb = probabilities.find(p => p.cardId === card.id);

          return (
            <div key={card.id} className={`grid-row ${isSelected ? 'selected' : ''}`}>
              <div className="card-cell">{card.name}</div>
              {gameState.players.map(player => {
                const status = getCardStatus(card.id, player.id);
                const playerProb = cardProb?.probabilities.find(p => p.playerId === player.id);
                const prob = playerProb?.probability || 0;

                return (
                  <div
                    key={player.id}
                    className={`status-cell ${status}`}
                    onClick={() => handleCellClick(card.id, player.id)}
                    title={`${(prob * 100).toFixed(1)}% chance`}
                  >
                    {status === 'has' && '✓'}
                    {status === 'not' && '✗'}
                    {status === 'maybe' && prob > 0 && (
                      <span className="prob-text">{(prob * 100).toFixed(0)}%</span>
                    )}
                  </div>
                );
              })}
              <div
                className={`envelope-cell ${cardProb?.envelopeProbability === 1 ? 'has' : cardProb?.envelopeProbability === 0 ? 'not' : 'maybe'}`}
                onClick={() => handleCellClick(card.id, null)}
                title={`${((cardProb?.envelopeProbability || 0) * 100).toFixed(1)}% chance`}
              >
                {cardProb?.envelopeProbability === 1 && '✓'}
                {cardProb?.envelopeProbability === 0 && '✗'}
                {cardProb && cardProb.envelopeProbability > 0 && cardProb.envelopeProbability < 1 && (
                  <span className="prob-text">{(cardProb.envelopeProbability * 100).toFixed(0)}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="card card-grid">
      <h2>Card Tracking Grid</h2>
      <p className="subtitle">
        Click a card name to select it, then click a player/envelope to mark ownership
      </p>
      <div className="legend">
        <div className="legend-item">
          <span className="legend-icon has">✓</span> Has card
        </div>
        <div className="legend-item">
          <span className="legend-icon not">✗</span> Doesn't have
        </div>
        <div className="legend-item">
          <span className="legend-icon maybe">%</span> Probability
        </div>
      </div>

      {renderCardSection('Suspects', SUSPECTS)}
      {renderCardSection('Locations', LOCATIONS)}
      {renderCardSection('Weapons', WEAPONS)}
    </div>
  );
}
