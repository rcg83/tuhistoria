import { Logo } from '../logo/Logo.tsx';
import './Navbar.scss';

type NavbarProps = {
  appName?: string;
}

export const Navbar = ({ appName = 'tuhistoria' }: NavbarProps) => {
  return (
    <nav>
      <Logo />
      <h2>{appName}</h2>
    </nav>
  );
}