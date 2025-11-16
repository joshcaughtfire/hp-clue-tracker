import { useState, useEffect } from 'react';
import { GameState, Player, Guess, CardKnowledge } from './types';
import { ALL_CARDS } from './data/cards';
import PlayerSetup from './components/PlayerSetup';
import MyCards from './components/MyCards';
import GuessEntry from './components/GuessEntry';
import GuessList from './components/GuessList';
import ProbabilityView from './components/ProbabilityView';
import CardGrid from './components/CardGrid';
import './App.css';

const STORAGE_KEY = 'hp-clue-tracker-state';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      parsed.guesses = parsed.guesses.map((g: any) => ({
        ...g,
        timestamp: new Date(g.timestamp)
      }));
      return parsed;
    }
    return {
      players: [],
      cards: ALL_CARDS,
      myCards: [],
      guesses: [],
      knowledge: [],
      solution: {
        suspect: null,
        location: null,
        weapon: null,
      },
    };
  });

  const [currentView, setCurrentView] = useState<'setup' | 'game'>('setup');
  const [activeTab, setActiveTab] = useState<'guesses' | 'probabilities' | 'cards'>('guesses');

  // Save to localStorage whenever game state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const handlePlayersSetup = (players: Player[]) => {
    setGameState(prev => ({ ...prev, players }));
  };

  const handleMyCardsSelect = (cardIds: string[]) => {
    const me = gameState.players.find(p => p.isMe);
    if (!me) return;

    // Update knowledge: I definitely have these cards
    const newKnowledge: CardKnowledge[] = cardIds.map(cardId => ({
      cardId,
      playerId: me.id,
      isKnown: true,
      isPossible: true,
    }));

    // Mark cards I don't have as not possible for me
    const otherCards = ALL_CARDS.filter(c => !cardIds.includes(c.id));
    const otherKnowledge: CardKnowledge[] = otherCards.map(card => ({
      cardId: card.id,
      playerId: me.id,
      isKnown: true,
      isPossible: false,
    }));

    setGameState(prev => ({
      ...prev,
      myCards: cardIds,
      knowledge: [...newKnowledge, ...otherKnowledge],
    }));
    setCurrentView('game');
  };

  const handleAddGuess = (guess: Omit<Guess, 'id' | 'round' | 'timestamp'>) => {
    const newGuess: Guess = {
      ...guess,
      id: crypto.randomUUID(),
      round: gameState.guesses.length + 1,
      timestamp: new Date(),
    };

    // Update knowledge based on guess
    const newKnowledge: CardKnowledge[] = [];

    // Players who passed don't have any of the three cards
    for (const playerId of newGuess.noCards) {
      [newGuess.suspect, newGuess.location, newGuess.weapon].forEach(cardId => {
        newKnowledge.push({
          cardId,
          playerId,
          isKnown: true,
          isPossible: false,
        });
      });
    }

    // If we know which card was shown
    if (newGuess.shown?.cardId) {
      newKnowledge.push({
        cardId: newGuess.shown.cardId,
        playerId: newGuess.shown.playerId,
        isKnown: true,
        isPossible: true,
      });
    }

    setGameState(prev => ({
      ...prev,
      guesses: [...prev.guesses, newGuess],
      knowledge: [...prev.knowledge, ...newKnowledge],
    }));
  };

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset the game? All data will be lost.')) {
      localStorage.removeItem(STORAGE_KEY);
      setGameState({
        players: [],
        cards: ALL_CARDS,
        myCards: [],
        guesses: [],
        knowledge: [],
        solution: {
          suspect: null,
          location: null,
          weapon: null,
        },
      });
      setCurrentView('setup');
    }
  };

  const handleMarkCardKnown = (cardId: string, playerId: string | null) => {
    setGameState(prev => ({
      ...prev,
      knowledge: [
        ...prev.knowledge.filter(k => k.cardId !== cardId),
        {
          cardId,
          playerId,
          isKnown: true,
          isPossible: true,
        },
      ],
    }));
  };

  if (currentView === 'setup') {
    return (
      <div className="app">
        <header>
          <h1>🧙 Harry Potter Clue Tracker</h1>
        </header>
        <main>
          {gameState.players.length === 0 ? (
            <PlayerSetup onComplete={handlePlayersSetup} />
          ) : (
            <MyCards
              cards={ALL_CARDS}
              myCards={gameState.myCards}
              onComplete={handleMyCardsSelect}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>🧙 HP Clue Tracker</h1>
        <button className="reset-btn" onClick={handleResetGame}>
          Reset Game
        </button>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'guesses' ? 'active' : ''}
          onClick={() => setActiveTab('guesses')}
        >
          Guesses
        </button>
        <button
          className={activeTab === 'probabilities' ? 'active' : ''}
          onClick={() => setActiveTab('probabilities')}
        >
          Probabilities
        </button>
        <button
          className={activeTab === 'cards' ? 'active' : ''}
          onClick={() => setActiveTab('cards')}
        >
          Card Grid
        </button>
      </nav>

      <main>
        {activeTab === 'guesses' && (
          <>
            <GuessEntry
              players={gameState.players}
              cards={ALL_CARDS}
              onAddGuess={handleAddGuess}
            />
            <GuessList guesses={gameState.guesses} gameState={gameState} />
          </>
        )}

        {activeTab === 'probabilities' && (
          <ProbabilityView gameState={gameState} />
        )}

        {activeTab === 'cards' && (
          <CardGrid
            gameState={gameState}
            onMarkCardKnown={handleMarkCardKnown}
          />
        )}
      </main>
    </div>
  );
}

export default App;
