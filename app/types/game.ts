export interface Game {
  id: string;
  player1: string;
  player1Image?: string;
  player2: string;
  player2Image?: string;
  time: string;
  votes: {
    player1Votes: number;
    player2Votes: number;
  };
  createdAt: Date;
}

export interface GameFormData {
  player1: string;
  player1Image?: string;
  player2: string;
  player2Image?: string;
  time: string;
}

export interface UserVotes {
  [gameId: string]: 1 | 2;
} 