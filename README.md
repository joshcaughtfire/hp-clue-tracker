# Harry Potter Clue Tracker

A React web application for tracking guesses and calculating probabilities in Harry Potter Clue (or standard Clue).

## Features

- **Player Management**: Set up 3-6 players and track card counts
- **Guess Tracking**: Record guesses, who passed, and who showed cards
- **Real-time Probability Calculation**: Automatically calculates which cards are most likely in the solution envelope
- **Card Grid View**: Visual grid showing who has/doesn't have each card
- **Mobile-Friendly**: Responsive design works great on phones and tablets
- **Local Storage**: Game state is automatically saved to your browser
- **Deduction Logic**: Automatically eliminates possibilities based on guess results

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

### Build for Production
```bash
npm run build
```

## How to Use

1. **Setup**: Enter player names and select which player is you
2. **Select Your Cards**: Click on all the cards that were dealt to you
3. **Record Guesses**:
   - Select who made the guess
   - Choose the three cards (suspect, location, weapon)
   - Mark which players passed (didn't have any of the three cards)
   - Mark who showed a card (and optionally which card if you saw it)
4. **View Probabilities**: See real-time calculations of which cards are most likely in the solution
5. **Use Card Grid**: Track detailed information about who has which cards

## Customizing Cards

To customize the cards to match your specific Clue game, edit the file:
```
src/data/cards.ts
```

Simply update the SUSPECTS, LOCATIONS, and WEAPONS arrays with your game's cards.

## Technologies Used

- React 19
- TypeScript
- Vite
- CSS3

## License

ISC
