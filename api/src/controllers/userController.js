import User from '../schemes/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Comprueba si el email ya está registrado.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    // Hashea la contraseña.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea el usuario.
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Usuario registrado correctamente', userId: user._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica si el usuario existe en la base de datos.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas (email)' });
    }

    // Compara la contraseña escrita con la hasheada en la BD.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas (password)' });
    }

    // Genera el Token JWT usando la clave del ".env".
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Solo para desarrollo. Para producción 1 hora.
    );

    // Envia respuesta con el token y datos básicos del usuario.
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        user: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al intentar loguear' });
  }
};

// OBTENER PERFIL DEL USUARIO (Ruta Protegida)
export const getUserProfile = async (req, res) => {
  try {
    // uscamos al usuario por el ID que el middleware "protect" extrajo del token
    // Usamos .select('-password') para que NO envíe la contraseña en la respuesta
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Enviamos los datos del usuario (seguros) al cliente.
    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

/* Obtener todos los usuarios solo con rol "admin". */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Excluye el "password".
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
  }
}