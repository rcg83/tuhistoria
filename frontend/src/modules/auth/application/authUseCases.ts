import type { AuthApi, LoginParams, RegisterParams } from "../../auth/domain/AuthApi";

export const loginUseCase = async (api: AuthApi, params: LoginParams) => {
  const { accessToken, user } = await api.authenticate(params);

  localStorage.setItem("token", accessToken);
  localStorage.setItem("auth_user", JSON.stringify(user)); 
  
  return user;
};

export const registerUseCase = async (api: AuthApi, params: RegisterParams) => {
  return api.register(params);
};

export const logoutUseCase = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("auth_user");
};
