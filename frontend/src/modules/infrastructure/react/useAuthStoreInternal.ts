import { useState } from 'react';
import { loginUseCase, checkAuthUseCase } from '../../application/authActions';
import { httpAuthApi } from '../api/httpAuthApi';
import type { LoginParams } from '../../domain/AuthApi';
import type { AuthState } from '../../domain/AuthStore';

export const useAuthStoreInternal = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
  });

  const login = (params: LoginParams) => loginUseCase(httpAuthApi, params, setState);
  const checkAuth = () => checkAuthUseCase(httpAuthApi, setState);
  const logout = () => {
    localStorage.removeItem("token");
    setState({ user: null, isLoggedIn: false, isLoading: false, error: null });
  };

  return { state, login, logout, checkAuth };
};
