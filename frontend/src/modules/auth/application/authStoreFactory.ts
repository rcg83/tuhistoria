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

type SetState = (fn: (state: AuthState) => AuthState) => void;

export const createAuthStore = (api: AuthApi, state: AuthState, setState: SetState) => {
  const execute = async (task: () => Promise<any>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await task();
      setState((prev) => ({ ...prev, user, isLoggedIn: true, isLoading: false }));
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false, error: "Error en la operación" }));
    }
  };

  return {
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    isLoading: state.isLoading,
    error: state.error,
    login: (params: LoginParams) => execute(() => loginUseCase(api, params)),
    logout: () => {
      logoutUseCase();
      setState(() => initialAuthState);
    },
  };
};
