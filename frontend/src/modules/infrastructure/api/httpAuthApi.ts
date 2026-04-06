import { httpClient } from "../../../api/httpClient";
import { type AuthApi, type JWToken, type Auth } from "../../domain/AuthApi";

export const httpAuthApi: AuthApi = {
    async authenticate(params): Promise<{ accessToken: JWToken }> {
        const data = await httpClient<{
            message: string;
            token: string;
            user: { id: string; username: string; user: string };
        }>("/api/login", {
            method: "POST",
            body: params,
        });

        return { accessToken: data.token };
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