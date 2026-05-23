import type { UserProfileRepository } from '../domain/UserProfileRepository.js';

export const getProfileUseCase = (profileRepo: UserProfileRepository) => {
  return async (userId: string): Promise<{ data?: Record<string, unknown>; error?: string; status?: number }> => {
    const profile = await profileRepo.findByUserId(userId);
    if (!profile) {
      return { error: 'Profile no encontrado', status: 404 };
    }
    return { data: profile };
  };
};

export const updateProfileUseCase = (profileRepo: UserProfileRepository) => {
  return async (userId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    return profileRepo.updateByUserId(userId, data);
  };
};
