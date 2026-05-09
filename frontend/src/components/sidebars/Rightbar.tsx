import { useAuth } from '../../features/auth/context/AuthContext';
import { UserButton } from '../../features/auth/components/UserButton';
import './Rightbar.scss';

export const Rightbar = () => {
  const { user, isLoggedIn, isLoading, setLoginOpen, logout } = useAuth();

  if (isLoading) {
    return <nav className="rightbar">Cargando...</nav>;
  }

  const handleAction = () => {
    if (isLoggedIn) {
      logout();
    } else {
      setLoginOpen(true);
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
