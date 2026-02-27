import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validación básica
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Comprobar si el email ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Respuesta
    res.status(201).json({ message: 'Usuario registrado correctamente', userId: user._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

/* LOGIN del usuario */
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
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Envia respuesta con el token y datos básicos del usuario.
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al intentar loguear' });
  }
};

// --- OBTENER PERFIL DEL USUARIO (Ruta Protegida) ---
export const getUserProfile = async (req, res) => {
  try {
    // 1. Buscamos al usuario por el ID que el middleware "protect" extrajo del token
    // Usamos .select('-password') para que NO envíe la contraseña en la respuesta
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2. Enviamos los datos del usuario (seguros) al cliente
    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};
