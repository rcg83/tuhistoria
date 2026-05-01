import { Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { BookWrapper } from './BookWrapper';
import { LoginForm } from '../auth/LoginForm';

export const BookLayout = () => {
  const { isLoginOpen } = useAuth();

  return (
    <BookWrapper 
      leftPage={<div>Contenido Izquierdo (Portada, etc.)</div>}
      rightPage={
        isLoginOpen ? <LoginForm /> : <Outlet />
      }
    />
  );
};
