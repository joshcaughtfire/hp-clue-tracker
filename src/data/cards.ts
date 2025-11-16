import { Card } from '../types';

export const SUSPECTS: Card[] = [
  { id: 'harry', name: 'Harry Potter', type: 'suspect' },
  { id: 'hermione', name: 'Hermione Granger', type: 'suspect' },
  { id: 'ron', name: 'Ron Weasley', type: 'suspect' },
  { id: 'draco', name: 'Draco Malfoy', type: 'suspect' },
  { id: 'snape', name: 'Severus Snape', type: 'suspect' },
  { id: 'voldemort', name: 'Lord Voldemort', type: 'suspect' },
];

export const LOCATIONS: Card[] = [
  { id: 'great-hall', name: 'Great Hall', type: 'location' },
  { id: 'library', name: 'Library', type: 'location' },
  { id: 'potions', name: 'Potions Classroom', type: 'location' },
  { id: 'owlery', name: 'Owlery', type: 'location' },
  { id: 'forbidden-forest', name: 'Forbidden Forest', type: 'location' },
  { id: 'quidditch-pitch', name: 'Quidditch Pitch', type: 'location' },
  { id: 'chamber-secrets', name: 'Chamber of Secrets', type: 'location' },
  { id: 'astronomy-tower', name: 'Astronomy Tower', type: 'location' },
  { id: 'room-requirement', name: 'Room of Requirement', type: 'location' },
];

export const WEAPONS: Card[] = [
  { id: 'wand', name: 'Wand', type: 'weapon' },
  { id: 'poison', name: 'Poison', type: 'weapon' },
  { id: 'basilisk', name: 'Basilisk Fang', type: 'weapon' },
  { id: 'potion', name: 'Polyjuice Potion', type: 'weapon' },
  { id: 'portkey', name: 'Portkey', type: 'weapon' },
  { id: 'spell', name: 'Unforgivable Curse', type: 'weapon' },
];

export const ALL_CARDS: Card[] = [...SUSPECTS, ...LOCATIONS, ...WEAPONS];
