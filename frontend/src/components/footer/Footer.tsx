import './Footer.scss';

type FooterProps = {
  text?: string;
  year?: number;
}

export const Footer = ({ text, year = new Date().getFullYear() }: FooterProps) => {
  return (
    <footer className="app-footer">
      {text && <span>{text} - {year}</span>}
      {!text && <span>{year}</span>}
    </footer>
  );
}
