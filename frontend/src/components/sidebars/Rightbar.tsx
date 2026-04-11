import { useState } from 'react';
import { useAuthContext } from '../../modules/infrastructure/react/useAuthContext';
import { LoginModal } from '../auth/LoginModal';
import { UserButton } from '../auth/UserButton';
import './Rightbar.scss';

export const Rightbar = () => {
  const { state, logout } = useAuthContext();
  const { user, isLoggedIn, isLoading } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <nav className="rightbar">Cargando...</nav>;
  }

  return (
    <nav className="rightbar">
      {isLoggedIn && user ? (
        <UserButton 
          username={user.username} 
          onLogout={logout} 
        />
      ) : (
        <button 
          className="rightbar__login-btn" 
          onClick={() => setIsModalOpen(true)}
        >
          Iniciar Sesión
        </button>
      )}

      {isModalOpen && (
        <LoginModal onClose={() => setIsModalOpen(false)} />
      )}
    </nav>
  );
};
