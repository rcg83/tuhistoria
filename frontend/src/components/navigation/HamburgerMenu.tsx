import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'src/features/auth/context/AuthContext';
import './HamburgerMenu.scss';

export const HamburgerMenu = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => setOpen(false);

  return (
    <div className="hamburger-menu" ref={ref}>
      <button
        className={`hamburger-menu__toggle${open ? ' hamburger-menu__toggle--open' : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-label="Menú"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="hamburger-menu__dropdown">
          <NavLink
            to="/my-stories"
            className={({ isActive }) =>
              `hamburger-menu__link${isActive ? ' hamburger-menu__link--active' : ''}`
            }
            onClick={handleNavClick}
          >
            Mis historias
          </NavLink>

          <NavLink
            to="/stories"
            end
            className={({ isActive }) =>
              `hamburger-menu__link${isActive ? ' hamburger-menu__link--active' : ''}`
            }
            onClick={handleNavClick}
          >
            Historias
          </NavLink>

          {user?.role === 'admin' && (
            <fieldset className="hamburger-menu__admin-section">
              <legend className="hamburger-menu__admin-legend">Administrador</legend>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `hamburger-menu__admin-link${isActive ? ' hamburger-menu__admin-link--active' : ''}`
                }
                onClick={handleNavClick}
              >
                Usuarios
              </NavLink>
              <NavLink
                to="/templates"
                className={({ isActive }) =>
                  `hamburger-menu__admin-link${isActive ? ' hamburger-menu__admin-link--active' : ''}`
                }
                onClick={handleNavClick}
              >
                Plantillas
              </NavLink>
            </fieldset>
          )}
        </div>
      )}
    </div>
  );
};
