export type TabName = 'home' | 'hearing' | 'account' | 'plans' | 'cleaning';
export type EarSide = 'left' | 'right';

export type HearingResponse = {
  left: boolean;
  right: boolean;
};

export type Arena = {
  id: number;
  name: string;
  days: number;
  reward: string;
};

export type Frequency = {
  hz: number;
  label: string;
  weight: number;
};

export type CleaningCard = {
  title: string;
  body: string;
  cta?: string;
};

export type UserMode = 'basic' | 'pro';

export type AppUser = {
  username: string;
  mode: UserMode;
  redeemedCode?: string | null;
};

export const ARENAS: Arena[] = [
  { id: 1, name: 'Arena 1', days: 30, reward: '🎖️' },
  { id: 2, name: 'Arena 2', days: 35, reward: '🏅' },
  { id: 3, name: 'Arena 3', days: 40, reward: '💎' },
  { id: 4, name: 'Arena 4', days: 45, reward: '👑' },
  { id: 5, name: 'Arena 5', days: 50, reward: '⭐' },
  { id: 6, name: 'Arena 6', days: 55, reward: '🔥' },
  { id: 7, name: 'Arena 7', days: 60, reward: '🌟' },
  { id: 8, name: 'Arena 8', days: 65, reward: '🏆' },
  { id: 9, name: 'Arena 9', days: 70, reward: '🎯' },
  { id: 10, name: 'Arena 10', days: 75, reward: '👑' },
];

export const FREQUENCIES: Frequency[] = [
  { hz: 125, label: 'Sub Bass', weight: 1.0 },
  { hz: 250, label: 'Bass', weight: 1.0 },
  { hz: 500, label: 'Low Mid', weight: 1.0 },
  { hz: 1000, label: 'Mid', weight: 1.0 },
  { hz: 2000, label: 'Upper Mid', weight: 1.1 },
  { hz: 4000, label: 'Presence', weight: 1.2 },
  { hz: 8000, label: 'Treble', weight: 1.4 },
  { hz: 12000, label: 'Air', weight: 1.8 },
  { hz: 14000, label: 'High Air', weight: 2.0 },
  { hz: 16000, label: 'Extreme', weight: 2.4 },
  { hz: 17000, label: 'Very Extreme', weight: 2.7 },
  { hz: 18000, label: 'Elite High', weight: 3.0 },
];

export const EDUCATIONAL_FACTS = [
  '🧼 Earwax is protective and helps defend the ear canal.',
  '👂 Human hearing is often strongest in the mid-range, not at the extremes.',
  '🔊 Long exposure to loud audio can reduce hearing sensitivity over time.',
  '🎧 Earbuds at high volume for long periods can make high-frequency loss worse.',
  '💧 Clean ears gently and avoid forcing objects deep into the ear canal.',
];

export const CLEANING_CARDS: CleaningCard[] = [
  {
    title: 'Ready to clean?',
    body:
      'Use your sanitation kit and follow each step in order. Tap begin to start the cleaning flow.',
    cta: 'Start Cleaning',
  },
  {
    title: 'Open your sanitation kit',
    body:
      'You should have a cleaning tool, microfiber cloth, bamboo brush, and isopropyl alcohol cleaning fluid.',
  },
  {
    title: 'Brush the mesh',
    body:
      'Spray the bamboo brush with the alcohol and hold the AirPod with the mesh facing up and brush in circles for about 15 seconds.',
  },
  {
    title: 'Blot the mesh',
    body:
      'Flip the AirPod and blot the mesh on our cloth, ensuring contact. Repeat this process three times total for each mesh.',
  },
  {
    title: 'Clean the charging port',
    body: 'Use our tool to scrape out any grime from the charging port.',
  },
  {
    title: 'Remove residue',
    body:
      'Rinse the brush with distilled water, then repeat the brushing and blotting steps with distilled water to remove residue.',
  },
  {
    title: 'Clean the charging case',
    body: 'Clean the insides of the charging case with the bamboo brush.',
  },
  {
    title: 'Final wipe',
    body: 'Wipe everything with the cleaning cloth.',
  },
  {
    title: 'Congratulations, you are done!',
    body:
      'Let the AirPods dry completely for at least a little while before use. Once everything is fully dry, place them back in the case.',
    cta: 'Restart Guide',
  },
];

export const TABS: { name: TabName; label: string; icon: string }[] = [
  { name: 'home', label: 'HOME', icon: '🏠' },
  { name: 'hearing', label: 'TEST', icon: '🎧' },
  { name: 'cleaning', label: 'CLEAN', icon: '🧼' },
  { name: 'account', label: 'PROFILE', icon: '👤' },
  { name: 'plans', label: 'PLANS', icon: '💎' },
];