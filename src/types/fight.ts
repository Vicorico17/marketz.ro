export interface Fight {
  id: string;
  fighter1: string;
  fighter2: string;
  fighter1Image?: string;
  fighter2Image?: string;
  date: string;
  category: string;
  predictions?: Map<string, number>;
} 