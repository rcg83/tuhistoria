import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserButton.scss';

import type { ReactNode } from 'react';

interface UserButtonProps {
  username?: string;
  isLoggedIn: boolean;
  onAction: () => void;
  avatarUrl?: string;
  children?: ReactNode;
}

export const UserButton = ({ username, isLoggedIn, onAction, avatarUrl, children }: UserButtonProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const initial = username ? username.charAt(0).toUpperCase() : '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = () => {
    setOpen(false);
    onAction();
  };

  const handleAvatarClick = () => {
    setOpen((p) => !p);
    if (isLoggedIn && window.innerWidth >= 1024) {
      navigate('/profile');
    }
  };

  return (
    <div className={`user-button ${!isLoggedIn ? 'user-button--guest' : ''}`} ref={ref}>
      <div className="user-button__avatar" onClick={handleAvatarClick}>
        {isLoggedIn ? (
          avatarUrl ? <img src={avatarUrl} alt={username} className="user-button__image" /> : <span className="user-button__initial">{initial}</span>
        ) : (
          <span className="user-button__icon">👤</span>
        )}
      </div>

      {open && (
        <div className="user-button__dropdown">
          {children}
          <button className="user-button__dropdown-item" onClick={handleAction}>
            Hasta luego
          </button>
        </div>
      )}
    </div>
  );
};
