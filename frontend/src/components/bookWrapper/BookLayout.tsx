import { Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { BookWrapper } from './BookWrapper';
import { LoginForm } from '../../features/auth/components/LoginForm';

export const BookLayout = () => {
  const { isLoginOpen, user } = useAuth();

  if (isLoginOpen || !user) {
    return (
      <BookWrapper 
        leftPage={<div className="book__cover">MERN Project</div>}
        rightPage={<LoginForm />}
      />
    );
  }

  return <Outlet />;
};
