import { useNavigate, useLocation } from 'react-router-dom';
import { HamburgerMenu } from '../navigation/HamburgerMenu';
import { Logo } from '../logo/Logo';
import { UserButton } from '../../features/auth/components/UserButton';
import { useAuth } from 'src/features/auth/context/AuthContext';
import './AppBar.scss';

export const AppBar = () => {
  const { user, isLoggedIn, setLoginOpen, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = () => {
    if (isLoggedIn) {
      logout();
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <div className="app-bar">
      <div className="app-bar__left">
        <HamburgerMenu />
      </div>
      <div className="app-bar__center">
        <Logo className="app-bar__logo light-theme" />
      </div>
      <div className="app-bar__right">
        <UserButton
          isLoggedIn={isLoggedIn}
          username={user?.username}
          onAction={handleAction}
        >
          <span className={`user-button__nav-item${location.pathname === '/profile' ? ' user-button__nav-item--active' : ''}`} onClick={() => navigate('/profile')}>Mi cuenta</span>
          <span className={`user-button__nav-item${location.pathname === '/achievements' ? ' user-button__nav-item--active' : ''}`} onClick={() => navigate('/achievements')}>Logros</span>
        </UserButton>
      </div>
    </div>
  );
};
