import { mongoUserRepository } from '../persistence/MongoUserRepository.js';
import { mongoUserProfileRepository } from '../persistence/MongoUserProfileRepository.js';
import { getAccountUseCase, getUsersUseCase, deleteUserUseCase } from '../../application/UserUseCases.js';
import { getProfileUseCase, updateProfileUseCase } from '../../application/UserProfileUseCases.js';

const userRepo = mongoUserRepository;
const profileRepo = mongoUserProfileRepository;

const getAccount = getAccountUseCase(userRepo);
const listUsers = getUsersUseCase(userRepo);
const removeUser = deleteUserUseCase(userRepo);
const getProfile = getProfileUseCase(profileRepo);
const updateProfile = updateProfileUseCase(profileRepo);

export const getUserAccount = async (req, res): Promise<void> => {
  try {
    const result = await getAccount(req.user.id);
    if (result.error) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    res.json(result.data);
  } catch {
    res.status(500).json({ message: 'Error al obtener los datos de la cuenta.' });
  }
};

export const getUserProfile = async (req, res): Promise<void> => {
  try {
    const result = await getProfile(req.user.id);
    if (result.error) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    res.json(result.data);
  } catch {
    res.status(500).json({ message: 'Error al obtener el profile.' });
  }
};

export const updateMyProfile = async (req, res): Promise<void> => {
  try {
    const updated = await updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

export const getUsers = async (req, res): Promise<void> => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
  }
};

export const deleteUser = async (req, res): Promise<void> => {
  try {
    const result = await removeUser(req.params.id);
    if (result.error) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};
