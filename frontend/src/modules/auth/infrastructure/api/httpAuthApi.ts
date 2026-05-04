import { httpClient } from "../../../../api/httpClient";
import {
  type AuthApi,
  type Auth,
  type AuthenticateResponse,
  type RegisterResponse,
  type RegisterParams
} from "../../../auth/domain/AuthApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const httpAuthApi: AuthApi = {
  async authenticate(params): Promise<AuthenticateResponse> {
    const data = await httpClient<{
      message: string;
      token: string;
      user: { id: string; username: string; user: string };
    }>(`${API_URL}/api/users/login`, {
      method: "POST",
      body: JSON.stringify(params),
    });

    return {
      accessToken: data.token,
      user: {
        id: data.user.id,
        username: data.user.username,
        role: data.user.user
      }
    };
  },

  async register(params: RegisterParams): Promise<RegisterResponse> {
    return httpClient<RegisterResponse>("/api/users/register", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async getAuth(): Promise<Auth> {
    const token = localStorage.getItem("token");

    const user = await httpClient<{
      id: string;
      username: string;
      user: string;
    }>(`${API_URL}/api/account`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      isLoggedIn: true,
      isLoading: false,
      user: {
        id: user.id,
        username: user.username,
        role: user.user,
      },
      error: null,
    };
  },
};
