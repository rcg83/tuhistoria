import { Logo } from '../logo/Logo.tsx';
import './Leftbar.scss';

export const Leftbar = () => {
  return (
    <nav className='leftbar-container'>
      <Logo width={64} height={64} className='light-theme'/>
    </nav>
  );
}