import { Logo } from '../logo/Logo.tsx';
import './Footer.scss';

type FooterProps = {
  text?: string;
  year?: number;
}

export const Footer = ({text = 'Todos los derechos reservados.', year = new Date().getFullYear()}: FooterProps) => {
  return (
    <footer>
      <p>{text}{year}</p>
      <Logo />
    </footer>
  );
}