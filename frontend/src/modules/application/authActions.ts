import type { AuthApi, LoginParams } from "../domain/AuthApi";

export const loginUseCase = async (api: AuthApi, params: LoginParams, setState: Function) => {
  setState((prev: any) => ({ ...prev, isLoading: true, error: null }));
  try {
    const { accessToken } = await api.authenticate(params);
    localStorage.setItem("token", accessToken);
    
    const authData = await api.getAuth();
    setState({ user: authData.user, isLoggedIn: true, isLoading: false, error: null });
  } catch (err: any) {
    setState((prev: any) => ({ ...prev, isLoading: false, error: "Error de login" }));
  }
};

export const checkAuthUseCase = async (api: AuthApi, setState: Function) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  setState((prev: any) => ({ ...prev, isLoading: true }));
  try {
    const authData = await api.getAuth();
    setState({ user: authData.user, isLoggedIn: true, isLoading: false, error: null });
  } catch {
    localStorage.removeItem("token");
    setState((prev: any) => ({ ...prev, user: null, isLoggedIn: false, isLoading: false }));
  }
};
