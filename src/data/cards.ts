import { Card } from '../types';

export const SUSPECTS: Card[] = [
  { id: 'draco', name: 'Draco Malfoy', type: 'suspect' },
  { id: 'crabbe-goyle', name: 'Crabbe & Goyle', type: 'suspect' },
  { id: 'lucius', name: 'Lucius Malfoy', type: 'suspect' },
  { id: 'umbridge', name: 'Dolores Umbridge', type: 'suspect' },
  { id: 'pettigrew', name: 'Peter Pettigrew', type: 'suspect' },
  { id: 'bellatrix', name: 'Bellatrix Lestrange', type: 'suspect' },
];

export const LOCATIONS: Card[] = [
  { id: 'great-hall', name: 'Great Hall', type: 'location' },
  { id: 'hospital-wing', name: 'Hospital Wing', type: 'location' },
  { id: 'room-requirement', name: 'Room of Requirement', type: 'location' },
  { id: 'potions', name: 'Potions Classroom', type: 'location' },
  { id: 'trophy-room', name: 'Trophy Room', type: 'location' },
  { id: 'divination', name: 'Divination Classroom', type: 'location' },
  { id: 'owlery', name: 'Owlery', type: 'location' },
  { id: 'library', name: 'Library', type: 'location' },
  { id: 'dada', name: 'Defense Against Dark Arts', type: 'location' },
];

export const WEAPONS: Card[] = [
  { id: 'sleeping-draught', name: 'Sleeping Draught', type: 'weapon' },
  { id: 'vanishing-cabinet', name: 'Vanishing Cabinet', type: 'weapon' },
  { id: 'portkey', name: 'Portkey', type: 'weapon' },
  { id: 'impedimenta', name: 'Impedimenta', type: 'weapon' },
  { id: 'petrificus', name: 'Petrificus Totalus', type: 'weapon' },
  { id: 'mandrake', name: 'Mandrake', type: 'weapon' },
];

export const ALL_CARDS: Card[] = [...SUSPECTS, ...LOCATIONS, ...WEAPONS];
