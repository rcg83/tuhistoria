import { Logo } from '../logo/Logo.tsx';
import './Navbar.scss';

type NavbarProps = {
  appName?: string;
}

export const Navbar = ({ appName }: NavbarProps) => {
  return (
    <nav>
      <Logo width={48} height={48}/>
      <h2>{appName}</h2>
    </nav>
  );
}