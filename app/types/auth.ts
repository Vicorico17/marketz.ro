export interface Admin {
  username: string;
  password: string;
}

export interface AdminState {
  isLoggedIn: boolean;
  currentUser?: string;
} 