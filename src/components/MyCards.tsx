import { useState } from 'react';
import { Card } from '../types';
import { SUSPECTS, LOCATIONS, WEAPONS } from '../data/cards';
import './MyCards.css';

interface Props {
  cards: Card[];
  myCards: string[];
  onComplete: (cardIds: string[]) => void;
}

export default function MyCards({ myCards, onComplete }: Props) {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(
    new Set(myCards)
  );

  const toggleCard = (cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  };

  const handleSubmit = () => {
    onComplete(Array.from(selectedCards));
  };

  const renderCardGroup = (title: string, cards: Card[]) => (
    <div className="card-group">
      <h3>{title}</h3>
      <div className="card-buttons">
        {cards.map(card => (
          <button
            key={card.id}
            className={`card-btn ${selectedCards.has(card.id) ? 'selected' : ''}`}
            onClick={() => toggleCard(card.id)}
          >
            {card.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card my-cards">
      <h2>Select Your Cards</h2>
      <p className="subtitle">
        Click on the cards that were dealt to you
      </p>

      {renderCardGroup('Suspects', SUSPECTS)}
      {renderCardGroup('Locations', LOCATIONS)}
      {renderCardGroup('Weapons', WEAPONS)}

      <div className="selected-count">
        Selected: {selectedCards.size} cards
      </div>

      <button onClick={handleSubmit} disabled={selectedCards.size === 0}>
        Start Game
      </button>
    </div>
  );
}
