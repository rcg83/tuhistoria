import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as string) as { id: string; role: string };
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Token no válido' });
    }
  } else {
    res.status(401).json({ message: 'No hay token, acceso denegado' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'No tienes permisos para esta acción' });
      return;
    }
    next();
  };
};
