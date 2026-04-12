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
      <div className="rightbar__user-container">
        <UserButton
          isLoggedIn={isLoggedIn}
          username={user?.username}
          onAction={isLoggedIn ? logout : () => setIsModalOpen(true)}
        />
      </div>

      {isModalOpen && (
        <LoginModal onClose={() => setIsModalOpen(false)} />
      )}
    </nav>
  );
};
