export interface Fight {
  id: string;
  fighter1: string;
  fighter2: string;
  date: string;
  category: string;
  predictions?: Map<string, number>;
} 