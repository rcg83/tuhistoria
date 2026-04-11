import './UserButton.scss';

interface UserButtonProps {
  username: string;
  onLogout: () => void;
  avatarUrl?: string;
}

export const UserButton = ({ username, onLogout, avatarUrl }: UserButtonProps) => {
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="user-button">
      <div className="user-button__avatar">
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} className="user-button__image" />
        ) : (
          <span className="user-button__initial">{initial}</span>
        )}
      </div>
      <div className="user-button__details">
        <span className="user-button__name">{username}</span>
        <button 
          className="user-button__logout" 
          onClick={onLogout}
          type="button"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
