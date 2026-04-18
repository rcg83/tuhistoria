import { type LoginParams, type Auth } from "./AuthApi";

export interface AuthState {
  user: Auth['user'];
  isLoggedIn: boolean;
  isLoading: boolean;
  isLoginOpen: boolean;
  error: string | null;
}

export interface AuthStore {
  state: AuthState;
  login: (params: LoginParams) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  toggleLogin: (isOpen: boolean) => void;
}
