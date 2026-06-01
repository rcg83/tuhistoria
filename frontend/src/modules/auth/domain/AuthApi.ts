export type JWToken = string;

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
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

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface AuthApi {
  authenticate(params: LoginParams): Promise<AuthenticateResponse>;
  register(params: RegisterParams): Promise<RegisterResponse>;
  getAuth(): Promise<Auth>;
}
