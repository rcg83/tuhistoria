import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import './NavButton.scss';

interface NavButtonProps {
  to: string;
  children: ReactNode;
}

export const NavButton = ({ to, children }: NavButtonProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-button${isActive ? ' nav-button--active' : ''}`
      }
      end
    >
      {children}
    </NavLink>
  );
};
