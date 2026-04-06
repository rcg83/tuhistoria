export type JWToken = string;

export interface LoginParams {
  username: string;
  password: string;
}

export interface User {
    id: string;
    username: string;
    role: string;
}

export interface Auth {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | null;
    error?: Error | Error[] | null;
}

export interface AuthApi {
    authenticate(params: { username: string; password: string }): Promise<{ accessToken: JWToken }>;
    getAuth(): Promise<Auth>;
}