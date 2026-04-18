import { useAuthContext } from '../../modules/infrastructure/react/useAuthContext';
import { BookWrapper } from '../bookWrapper/BookWrapper';
import { LoginForm } from '../auth/LoginForm';

export const BookHome = () => {
  const { state } = useAuthContext();
  const { isLoginOpen } = state;

  return (
    <BookWrapper 
      leftPage={<div>Contenido Izquierdo (Portada, etc.)</div>}
      rightPage={
        isLoginOpen ? <LoginForm /> : <div>Contenido Normal de la Derecha</div>
      }
    />
  );
};
