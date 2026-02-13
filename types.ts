
export type Dimension = 'NORMAL' | 'UPSIDE_DOWN';

export interface Position {
  x: number;
  y: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'TOOL' | 'CONSUMABLE' | 'QUEST_ITEM';
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  position: Position;
  avatar: string;
  dialogue: string[];
  theorySubject: string;
  rewardItemId?: string;
  requiredItemId?: string; // Nuovo: Oggetto necessario per interagire
  level: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'INACTIVE' | 'ACTIVE' | 'COMPLETED';
  isMain: boolean;
}

export interface GameState {
  playerPos: Position;
  dimension: Dimension;
  inventory: string[]; 
  activeQuests: Quest[];
  completedQuests: string[];
  currentLevel: number;
}
