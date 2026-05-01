import { useAuth } from '../../features/auth/context/AuthContext';
import { UserButton } from '../auth/UserButton';
import './Rightbar.scss';

export const Rightbar = () => {
  const { user, isLoggedIn, isLoading, setLoginOpen, logout } = useAuth();

  if (isLoading) {
    return <nav className="rightbar">Cargando...</nav>;
  }

  const handleAction = () => {
    console.log("button pushed");
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
