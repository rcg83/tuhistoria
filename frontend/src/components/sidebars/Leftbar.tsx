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
          <>
<NavLink to="/users" className="leftbar__admin-link">Admin Usuarios</NavLink>
<NavLink to="/templates" className="leftbar__admin-link">Admin Plantillas</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};
