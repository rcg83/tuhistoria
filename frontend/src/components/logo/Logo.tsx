import './Logo.scss';

type LogoProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const Logo = ({ src, alt, width, height, className }: LogoProps) => {
  return (
    <div className='logo-container'>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </div>
  );
}

export default Logo;