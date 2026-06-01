import { Logo } from '../logo/Logo.tsx';
import { NavButton } from '../navigation/NavButton';
import './Leftbar.scss';

export const Leftbar = () => {
  return (
    <nav className='leftbar'>
      <div className="leftbar__logo-container">
        <Logo className='leftbar__logo light-theme'/>
      </div>
      <div className="leftbar__nav">
        <NavButton to="/my-stories">Mis historias</NavButton>
        <NavButton to="/stories">Historias</NavButton>
      </div>
      <footer className="leftbar__footer">
        <span>Proyecto 2º DAW</span>
        <hr className="leftbar__footer-divider" />
        <span>Autor Ramón Céspedes</span>
      </footer>
    </nav>
  );
};
