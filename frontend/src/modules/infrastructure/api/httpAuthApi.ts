import { httpClient } from "../../../api/httpClient";
import { 
  type AuthApi, 
  type Auth, 
  type AuthenticateResponse,
  type RegisterResponse,
  type RegisterParams
} from "../../domain/AuthApi";

export const httpAuthApi: AuthApi = {
    async authenticate(params): Promise<AuthenticateResponse> {
        const data = await httpClient<{
            message: string;
            token: string;
            user: { id: string; username: string; user: string };
        }>("/api/users/login", {
            method: "POST",
            body: params,
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
      body: params,
    });
  },

    async getAuth(): Promise<Auth> {
        const user = await httpClient<{
            id: string;
            username: string;
            user: string;
        }>("/api/account", {
            method: "GET",
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
