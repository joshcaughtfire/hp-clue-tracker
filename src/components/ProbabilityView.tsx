import { GameState } from '../types';
import { getSolutionProbabilities } from '../utils/probabilities';
import './ProbabilityView.css';

interface Props {
  gameState: GameState;
}

export default function ProbabilityView({ gameState }: Props) {
  const probabilities = getSolutionProbabilities(gameState);

  const formatPercent = (prob: number) => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  const renderProbabilitySection = (
    title: string,
    cards: ReturnType<typeof getSolutionProbabilities>['suspect']
  ) => (
    <div className="probability-section">
      <h3>{title}</h3>
      <div className="probability-list">
        {cards.map(card => (
          <div key={card.cardId} className="probability-item">
            <div className="card-info">
              <span className="card-name">{card.cardName}</span>
              <span
                className={`probability ${
                  card.envelopeProbability > 0.5 ? 'high' :
                  card.envelopeProbability > 0.2 ? 'medium' : 'low'
                }`}
              >
                {formatPercent(card.envelopeProbability)}
              </span>
            </div>
            <div className="probability-bar">
              <div
                className="probability-fill"
                style={{ width: formatPercent(card.envelopeProbability) }}
              />
            </div>
            <div className="player-probabilities">
              {card.probabilities
                .filter(p => p.probability > 0)
                .map(p => (
                  <div key={p.playerId} className="player-prob">
                    <span className="player-name">{p.playerName}</span>
                    <span className="player-percentage">
                      {formatPercent(p.probability)}
                      {p.isKnown && ' ✓'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card probability-view">
      <h2>Solution Probabilities</h2>
      <p className="subtitle">
        Cards most likely to be in the solution envelope
      </p>

      {renderProbabilitySection('Suspects', probabilities.suspect)}
      {renderProbabilitySection('Locations', probabilities.location)}
      {renderProbabilitySection('Weapons', probabilities.weapon)}

      <div className="best-guess">
        <h3>Best Guess</h3>
        <div className="guess-cards">
          <div className="guess-card suspect">
            <span className="type">Suspect</span>
            <span className="name">{probabilities.suspect[0]?.cardName || 'Unknown'}</span>
            <span className="prob">{formatPercent(probabilities.suspect[0]?.envelopeProbability || 0)}</span>
          </div>
          <div className="guess-card location">
            <span className="type">Location</span>
            <span className="name">{probabilities.location[0]?.cardName || 'Unknown'}</span>
            <span className="prob">{formatPercent(probabilities.location[0]?.envelopeProbability || 0)}</span>
          </div>
          <div className="guess-card weapon">
            <span className="type">Weapon</span>
            <span className="name">{probabilities.weapon[0]?.cardName || 'Unknown'}</span>
            <span className="prob">{formatPercent(probabilities.weapon[0]?.envelopeProbability || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
