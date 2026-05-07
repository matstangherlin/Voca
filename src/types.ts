export interface Word {
  id: string;
  word: string;
  pronunciation?: string;
  meaning: string;
  etymology: string;
  examples: string[];
  category: 'literário' | 'científico' | 'cotidiano' | 'arcaico' | 'expressão';
  addedDate: string;
}

export interface UserProgress {
  userId: string;
  learnedWords: string[]; // word IDs
  favoriteWords: string[]; // word IDs
  streak: number;
  lastActive: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Mestre';
  points: number;
}
