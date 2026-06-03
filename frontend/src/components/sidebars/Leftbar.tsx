import { NavLink } from 'react-router-dom';
import { Logo } from '../logo/Logo.tsx';
import { NavButton } from '../navigation/NavButton';
import { useAuth } from '../../features/auth/context/AuthContext';
import './Leftbar.scss';

export const Leftbar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <nav className='leftbar'>
      <div className="leftbar__logo-container">
        <Logo className='leftbar__logo light-theme'/>
      </div>
      <div className="leftbar__nav">
        <NavButton to="/my-stories">Mis historias</NavButton>
        <NavButton to="/stories">Historias</NavButton>
        {isAdmin && (
          <fieldset className="leftbar__admin-section">
            <legend className="leftbar__admin-legend">Administrador</legend>
            <NavLink to="/users" className={({ isActive }) => `leftbar__admin-link${isActive ? ' leftbar__admin-link--active' : ''}`}>Usuarios</NavLink>
            <NavLink to="/templates" className={({ isActive }) => `leftbar__admin-link${isActive ? ' leftbar__admin-link--active' : ''}`}>Plantillas</NavLink>
          </fieldset>
        )}
      </div>
    </nav>
  );
};
