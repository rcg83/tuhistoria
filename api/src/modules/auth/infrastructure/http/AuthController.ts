import type { Request, Response } from 'express';
import { mongoUserRepository } from '../../../user/infrastructure/persistence/MongoUserRepository.js';
import { mongoUserProfileRepository } from '../../../user/infrastructure/persistence/MongoUserProfileRepository.js';
import { registerUseCase, loginUseCase } from '../../application/AuthUseCases.js';

const userRepo = mongoUserRepository;
const profileRepo = mongoUserProfileRepository;

const register = registerUseCase(userRepo, profileRepo);
const login = loginUseCase(userRepo);

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const result = await register({ username, email, password });
    if (result.error) {
      res.status(result.status!).json({ message: result.error });
      return;
    }
    res.status(201).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    if (result.error) {
      res.status(result.status!).json({ message: result.error });
      return;
    }
    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al intentar loguear' });
  }
};
