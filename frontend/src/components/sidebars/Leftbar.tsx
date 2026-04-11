import { Logo } from '../logo/Logo.tsx';
import './Leftbar.scss';

export const Leftbar = () => {
  return (
    <nav className='leftbar'>
      <div className="leftbar__logo-container">
        <Logo className='leftbar__logo light-theme'/>
      </div>
    </nav>
  );
}
