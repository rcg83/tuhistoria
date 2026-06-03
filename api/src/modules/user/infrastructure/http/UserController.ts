import { mongoUserRepository } from '../persistence/MongoUserRepository.js';
import { mongoUserProfileRepository } from '../persistence/MongoUserProfileRepository.js';
import { getAccountUseCase, getUsersUseCase, deleteUserUseCase, updateAccountUseCase, updateUserRoleUseCase, adminUpdateUserUseCase } from '../../application/UserUseCases.js';
import { getProfileUseCase, updateProfileUseCase } from '../../application/UserProfileUseCases.js';

const userRepo = mongoUserRepository;
const profileRepo = mongoUserProfileRepository;

const getAccount = getAccountUseCase(userRepo);
const listUsers = getUsersUseCase(userRepo);
const removeUser = deleteUserUseCase(userRepo);
const editAccount = updateAccountUseCase(userRepo);
const changeRole = updateUserRoleUseCase(userRepo);
const adminUpdate = adminUpdateUserUseCase(userRepo);
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

export const updateMyAccount = async (req, res): Promise<void> => {
  try {
    const { username, email } = req.body;
    const result = await editAccount(req.user.id, { username, email });
    if (result.error) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    res.json(result.data);
  } catch {
    res.status(500).json({ message: 'Error al actualizar la cuenta' });
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

export const updateUserRole = async (req, res): Promise<void> => {
  try {
    const { role } = req.body;
    const result = await changeRole(req.params.id, role);
    if (result.error) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    res.json(result.data);
  } catch {
    res.status(500).json({ message: 'Error al actualizar el rol' });
  }
};

export const adminUpdateUser = async (req, res): Promise<void> => {
  try {
    const { username, email, role } = req.body;
    const result = await adminUpdate(req.params.id, { username, email, role });
    if (result.error) {
      res.status(result.status).json({ message: result.error });
      return;
    }
    res.json(result.data);
  } catch {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
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
