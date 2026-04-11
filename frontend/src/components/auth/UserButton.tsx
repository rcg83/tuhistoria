import './UserButton.scss';

interface UserButtonProps {
  username?: string;
  isLoggedIn: boolean;
  onAction: () => void;
  avatarUrl?: string;
}

export const UserButton = ({ username, isLoggedIn, onAction, avatarUrl }: UserButtonProps) => {
  const initial = username ? username.charAt(0).toUpperCase() : '';

  return (
    <div className={`user-button ${!isLoggedIn ? 'user-button--guest' : ''}`} onClick={onAction}>
      <div className="user-button__avatar">
        {isLoggedIn ? (
          avatarUrl ? <img src={avatarUrl} alt={username} className="user-button__image" /> : <span className="user-button__initial">{initial}</span>
        ) : (
          <span className="user-button__icon">👤</span>
        )}
      </div>
      {isLoggedIn && username && (
        <div className="user-button__details">
          <span className="user-button__name">{username}</span>
          <span className="user-button__logout-text">Cerrar sesión</span>
        </div>
      )}
    </div>
  );
};
