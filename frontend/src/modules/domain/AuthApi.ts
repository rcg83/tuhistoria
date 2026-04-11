export type JWToken = string;

export interface LoginParams {
  email: string;
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

export interface AuthenticateResponse {
  accessToken: string;
  user: User;
}

export interface AuthApi {
  authenticate(params: LoginParams): Promise<AuthenticateResponse>;
  getAuth(): Promise<Auth>;
}
