import { useAuthContext } from '../../modules/infrastructure/react/useAuthContext';
import './Rightbar.scss';

export const Rightbar = () => {
  const { state, logout } = useAuthContext();
  const { user, isLoggedIn, isLoading } = state;

  if (isLoading) return <nav className='rightbar-container'>Cargando...</nav>;

  return (
    <nav className='rightbar-container'>
      {isLoggedIn && user ? (
        <div>
          <span>{user.username}</span>
          <button onClick={logout}>Salir</button>
        </div>
      ) : (
        <button>Iniciar Sesión</button>
      )}
    </nav>
  );
}
