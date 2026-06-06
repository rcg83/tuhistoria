import { loginUseCase, registerUseCase, logoutUseCase } from "./authUseCases";
import type { AuthApi, LoginParams, RegisterParams } from "../../auth/domain/AuthApi";

export interface AuthState {
  user: any | null;
  isLoggedIn: boolean;
  isLoginOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const getInitialUser = () => {
  if (isTokenExpired()) {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    return null;
  }
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
      const message = err instanceof Error ? err.message : "Error en la operación";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  };

  const executeRegister = async (task: () => Promise<any>): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await task();
      setState((prev) => ({ ...prev, isLoading: false, error: null }));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error en la operación";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      return false;
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
    register: (params: RegisterParams): Promise<boolean> => executeRegister(() => registerUseCase(api, params)),
    updateUser: (user: any) => {
      localStorage.setItem('auth_user', JSON.stringify(user));
      setState((prev) => ({ ...prev, user }));
    },
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
