import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HamburgerMenu } from '../navigation/HamburgerMenu';
import { UserButton } from '../../features/auth/components/UserButton';
import { useAuth } from 'src/features/auth/context/AuthContext';
import './AppBar.scss';

export const AppBar = () => {
  const { user, isLoggedIn, setLoginOpen, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleAction = () => {
    if (isLoggedIn) {
      setConfirmLogout(true);
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <div className="app-bar">
      <div className="app-bar__left">
        <HamburgerMenu />
      </div>
      <div className="app-bar__right">
        <UserButton
          isLoggedIn={isLoggedIn}
          username={user?.username}
          onAvatarClick={() => navigate('/profile')}
          onAction={handleAction}
        >
          <span className={`user-button__nav-item${location.pathname === '/profile' ? ' user-button__nav-item--active' : ''}`} onClick={() => navigate('/profile')}>Mi cuenta</span>
          <span className={`user-button__nav-item${location.pathname === '/achievements' ? ' user-button__nav-item--active' : ''}`} onClick={() => navigate('/achievements')}>Logros</span>
        </UserButton>
      </div>

      {confirmLogout && (
        <div className="app-bar__confirm-overlay" onClick={() => setConfirmLogout(false)}>
          <div className="app-bar__confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p className="app-bar__confirm-text">¿Te vas ya?</p>
            <div className="app-bar__confirm-actions">
              <button className="app-bar__confirm-cancel" onClick={() => setConfirmLogout(false)}>Cancelar</button>
              <button className="app-bar__confirm-logout" onClick={() => { setConfirmLogout(false); logout(); }}>Sí, salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
