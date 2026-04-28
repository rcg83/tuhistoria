import { useAuth } from '../../features/auth/context/AuthContext';
import { UserButton } from '../auth/UserButton';
import './Rightbar.scss';

export const Rightbar = () => {
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  if (isLoading) {
    return <nav className="rightbar">Cargando...</nav>;
  }

  const handleAction = () => {
    if (isLoggedIn) {
      logout();
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
