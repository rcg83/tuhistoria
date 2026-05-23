import { loginUseCase, registerUseCase, logoutUseCase } from "./authUseCases";
import type { AuthApi, LoginParams, RegisterParams } from "../../auth/domain/AuthApi";

export interface AuthState {
  user: any | null;
  isLoggedIn: boolean;
  isLoginOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const getInitialUser = () => {
  const savedUser = localStorage.getItem('auth_user');
  try {
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const initialUser = getInitialUser();

export const initialAuthState: AuthState = {
  user: initialUser,
  isLoggedIn: !!initialUser,
  isLoginOpen: false,
  isLoading: false,
  error: null,
};

type SetState = (fn: (state: AuthState) => AuthState) => void;

export const createAuthStore = (api: AuthApi, state: AuthState, setState: SetState) => {
  const execute = async (task: () => Promise<any>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await task();
      setState((prev) => ({ 
        ...prev, 
        user, 
        isLoggedIn: true, 
        isLoading: false, 
        isLoginOpen: false 
      }));
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false, error: "Error en la operación" }));
    }
  };

  const executeRegister = async (task: () => Promise<any>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await task();
      setState((prev) => ({ ...prev, isLoading: false, error: null }));
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false, error: "Error en la operación" }));
    }
  };

  return {
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    isLoginOpen: state.isLoginOpen,
    isLoading: state.isLoading,
    error: state.error,
    setLoginOpen: (open: boolean) => setState((prev) => ({ ...prev, isLoginOpen: open })),
    login: (params: LoginParams) => execute(() => loginUseCase(api, params)),
    register: (params: RegisterParams) => executeRegister(() => registerUseCase(api, params)),
    logout: () => {
      logoutUseCase();
      setState(() => ({
        ...initialAuthState,
        user: null,
        isLoggedIn: false,
        isLoginOpen: false
      }));
    },
  };
};
