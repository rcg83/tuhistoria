import type { UserRepository } from '../domain/UserRepository.js';

export const getAccountUseCase = (userRepo: UserRepository) => {
  return async (userId: string): Promise<{ data?: Record<string, unknown>; error?: string; status?: number }> => {
    const user = await userRepo.findById(userId);
    if (!user) {
      return { error: 'Usuario no encontrado', status: 404 };
    }
    return { data: user };
  };
};

export const getUsersUseCase = (userRepo: UserRepository) => {
  return async (): Promise<Record<string, unknown>[]> => {
    return userRepo.findAll();
  };
};

export const deleteUserUseCase = (userRepo: UserRepository) => {
  return async (id: string): Promise<{ data?: Record<string, unknown>; error?: string; status?: number }> => {
    const deleted = await userRepo.deleteById(id);
    if (!deleted) {
      return { error: 'Usuario no encontrado', status: 404 };
    }
    return { data: deleted };
  };
};
