import Logo from '../logo/Logo.tsx';
import './Navbar.scss';

type NavbarProps = {
  appName: string;

}

export const Navbar = ({ appName }: NavbarProps) => {
  return (
    <nav>
      <Logo
        src='/tuhistoria.svg'
        alt='logotipo de la aplicación web tuhistoria'
      />
      <h2>{appName}</h2>
    </nav>
  );
}