import { useAuthContext } from '../../modules/infrastructure/react/useAuthContext';
import { UserButton } from '../auth/UserButton';
import './Rightbar.scss';

export const Rightbar = () => {
  const { state, logout, toggleLogin } = useAuthContext();
  const { user, isLoggedIn, isLoading, isLoginOpen } = state;

  if (isLoading) {
    return <nav className="rightbar">Cargando...</nav>;
  }

  const handleAction = () => {
    if (isLoggedIn) {
      logout();
    } else {
      // Si está abierto lo cerramos, si está cerrado lo abrimos
      toggleLogin(!isLoginOpen);
    }
  };

  return (
    <nav className="rightbar">
      <div className="rightbar__user-container">
        <UserButton
          isLoggedIn={isLoggedIn}
          username={user?.username}
          onAction={handleAction}
        />
      </div>
    </nav>
  );
};
