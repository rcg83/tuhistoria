import type { UserRepository } from '../../user/domain/UserRepository.js';
import type { UserProfileRepository } from '../../user/domain/UserProfileRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUseCase = (
  userRepo: UserRepository,
  profileRepo: UserProfileRepository
) => {
  return async (data: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ data?: Record<string, unknown>; error?: string; status?: number }> => {
    if (!data.username || !data.email || !data.password) {
      return { error: 'Todos los campos son obligatorios', status: 400 };
    }

    const existing = await userRepo.findByEmail(data.email);
    if (existing) {
      return { error: 'Email ya registrado', status: 400 };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await userRepo.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    await profileRepo.create({
      user: (user as { _id: string })._id,
      bio: '',
      avatarUrl: '',
      location: '',
    });

    return { data: { message: 'Usuario registrado correctamente', userId: (user as { _id: string })._id } };
  };
};

export const loginUseCase = (userRepo: UserRepository) => {
  return async (email: string, password: string): Promise<{
    data?: Record<string, unknown>;
    error?: string;
    status?: number;
  }> => {
    if (!email || !password) {
      return { error: 'Todos los campos son obligatorios', status: 400 };
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return { error: 'Credenciales inválidas', status: 400 };
    }

    const isMatch = await bcrypt.compare(password, (user as { password: string }).password);
    if (!isMatch) {
      return { error: 'Credenciales inválidas', status: 400 };
    }

    const token = jwt.sign(
      { id: (user as { _id: string })._id, role: (user as { role: string }).role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return {
      data: {
        message: 'Login exitoso',
        token,
        user: {
          id: (user as { _id: string })._id,
          username: (user as { username: string }).username,
          role: (user as { role: string }).role,
        },
      },
    };
  };
};
