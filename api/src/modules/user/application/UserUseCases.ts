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

export const updateAccountUseCase = (userRepo: UserRepository) => {
  return async (userId: string, data: { username?: string; email?: string }): Promise<{
    data?: Record<string, unknown>;
    error?: string;
    status?: number;
  }> => {
    if (data.email) {
      const existing = await userRepo.findByEmail(data.email);
      if (existing && (existing as { _id: string })._id.toString() !== userId) {
        return { error: 'Email ya registrado', status: 400 };
      }
    }
    const updated = await userRepo.updateById(userId, data);
    if (!updated) {
      return { error: 'Usuario no encontrado', status: 404 };
    }
    return { data: updated };
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
