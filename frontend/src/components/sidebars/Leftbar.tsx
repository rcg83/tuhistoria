import { Logo } from '../logo/Logo.tsx';
import './Leftbar.scss';

export const Leftbar = () => {
  return (
    <nav className='leftbar-container'>
      <Logo width={48} height={48} className='dark-theme'/>
    </nav>
  );
}