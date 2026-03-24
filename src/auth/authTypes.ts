export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
