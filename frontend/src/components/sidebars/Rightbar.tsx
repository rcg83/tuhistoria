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
      <div className="rightbar__nav">
        <span className="rightbar__nav-item">Mis cosas</span>
        <span className="rightbar__nav-item">Logros</span>
        <span className="rightbar__nav-item rightbar__nav-item--push-bottom">Hasta luego</span>
      </div>
    </nav>
  );
};
