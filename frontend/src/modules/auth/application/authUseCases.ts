import type { AuthApi, LoginParams } from "../../domain/AuthApi";

export const loginUseCase = async (api: AuthApi, params: LoginParams) => {
  const { accessToken, user } = await api.authenticate(params);
  localStorage.setItem("token", accessToken);
  return user;
};

export const logoutUseCase = () => {
  localStorage.removeItem("token");
};
