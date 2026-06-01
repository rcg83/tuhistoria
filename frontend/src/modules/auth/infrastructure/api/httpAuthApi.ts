import { fetcher } from "src/lib/fetcher";
import {
  type AuthApi,
  type Auth,
  type AuthenticateResponse,
  type RegisterResponse,
  type RegisterParams
} from "../../../auth/domain/AuthApi";

const API_URL = import.meta.env.VITE_API_URL;

export const httpAuthApi: AuthApi = {
  async authenticate(params): Promise<AuthenticateResponse> {
    const data = await fetcher<{
      message: string;
      token: string;
      user: { id: string; username: string; email: string; role: string };
    }>(`${API_URL}/api/users/login`, {
      method: "POST",
      body: JSON.stringify(params),
    });

    return {
      accessToken: data.token,
      user: {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role
      }
    };
  },

  async register(params: RegisterParams): Promise<RegisterResponse> {
    return fetcher<RegisterResponse>(`${API_URL}/api/users/register`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async getAuth(): Promise<Auth> {
    const token = localStorage.getItem("token");

    const user = await fetcher<{
      _id: string;
      username: string;
      email: string;
      role: string;
    }>(`${API_URL}/api/users/account`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      isLoggedIn: true,
      isLoading: false,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      error: null,
    };
  },
};
