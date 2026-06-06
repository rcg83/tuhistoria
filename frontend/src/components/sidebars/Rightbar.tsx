import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { UserButton } from '../../features/auth/components/UserButton';
import { Button } from '../buttons/Button';
import './Rightbar.scss';

export const Rightbar = () => {
  const { user, isLoggedIn, isLoading, setLoginOpen, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (isLoading) {
    return <nav className="rightbar">Cargando...</nav>;
  }

  const handleAction = () => {
    if (isLoggedIn) {
      setConfirmLogout(true);
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
        <span className={`rightbar__nav-item${location.pathname === '/profile' ? ' rightbar__nav-item--active' : ''}`} onClick={() => navigate('/profile')}>Mi cuenta</span>
        <span className={`rightbar__nav-item${location.pathname === '/achievements' ? ' rightbar__nav-item--active' : ''}`} onClick={() => navigate('/achievements')}>Logros</span>
        <span className="rightbar__nav-item rightbar__nav-item--push-bottom" onClick={handleAction}>Hasta luego</span>
      </div>

      {confirmLogout && (
        <div className="rightbar__confirm-overlay" onClick={() => setConfirmLogout(false)}>
          <div className="rightbar__confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p className="rightbar__confirm-text">¿Te vas ya?</p>
            <div className="rightbar__confirm-actions">
              <Button onClick={() => setConfirmLogout(false)}>Cancelar</Button>
              <Button variant="danger" onClick={() => { setConfirmLogout(false); logout(); }}>Sí, salir</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
