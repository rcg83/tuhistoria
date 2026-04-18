import { type LoginParams, type AuthApi } from "../domain/AuthApi";
import { type AuthStore, type AuthState } from "../domain/AuthStore";

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  isLoginOpen: false,
  error: null,
};

export const authStore = (api: AuthApi): AuthStore => ({
  state: initialState,

  async login(params: LoginParams) {
    this.state = { ...this.state, isLoading: true, error: null };
    try {
      const { accessToken } = await api.authenticate(params);
      localStorage.setItem("token", accessToken);

      await this.checkAuth();
      this.toggleLogin(false);
    } catch (err: any) {
      this.state = { ...this.state, isLoading: false, error: err.message || "Error al iniciar sesión" };
    }
  },

  async checkAuth() {
    this.state = { ...this.state, isLoading: true };
    try {
      const authData = await api.getAuth();
      this.state = {
        ...this.state,
        user: authData.user,
        isLoggedIn: true,
        isLoading: false,
      };
    } catch {
      this.logout();
    }
  },

  logout() {
    localStorage.removeItem("token");
    this.state = initialState;
  },

  toggleLogin(isOpen: boolean) {
    this.state = { ...this.state, isLoginOpen: isOpen };
  },
});
