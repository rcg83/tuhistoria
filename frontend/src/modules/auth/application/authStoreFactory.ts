import { loginUseCase, logoutUseCase } from "./authUseCases";
import type { AuthApi, LoginParams } from "../../domain/AuthApi";

export interface AuthState {
  user: any | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

export const initialAuthContextValue = {
  ...initialAuthState,
  login: async (_params: LoginParams) => {},
  logout: () => {},
};

type SetState = (fn: (state: AuthState) => AuthState) => void;

export const createAuthStore = (api: AuthApi, setState: SetState) => {
  const execute = async (task: () => Promise<any>) => {
    setState((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const user = await task();
      setState((state) => ({ ...state, user, isLoggedIn: true, isLoading: false }));
    } catch (err) {
      setState((state) => ({ ...state, isLoading: false, error: "Error en la operación" }));
    }
  };

  return {
    login: (params: LoginParams) => execute(() => loginUseCase(api, params)),
    logout: () => {
      logoutUseCase();
      setState(() => initialAuthState);
    }
  };
};
