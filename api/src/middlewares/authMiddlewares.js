import jwt from 'jsonwebtoken';

/* Middleware "protect" comprueba que la petición tenga un token JWT válido y añade los datos del usuario a req.user. */
export const protect = (req, res, next) => {
	let token = req.headers.authorization;

	if (token && token.startsWith('Bearer')) {
		try {
			// Extrae el token (quita la palabra 'Bearer ').
			const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

			// Guarda el ID del usuario en la petición para que el controlador lo use.
			req.user = decoded;
			next();
		} catch (error) {
			res.status(401).json({ message: 'Token no válido' });
		}
	} else {
		res.status(401).json({ message: 'No hay token, acceso denegado' });
	}
};

/* Middleware "authorize" comprueba que el usuario tenga el rol requerido para acceder. */
export const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'No tienes permisos para esta acción' });
		}
		next();
	}
}