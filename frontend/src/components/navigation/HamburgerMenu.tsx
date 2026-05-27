import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useStories } from '../../features/stories/context/StoriesContext';
import './HamburgerMenu.scss';

export const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { selected } = useStories();

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
          {selected && (
            <NavLink
              to={`/story/${selected._id}`}
              className={({ isActive }) =>
                `hamburger-menu__link${isActive ? ' hamburger-menu__link--active' : ''}`
              }
              onClick={handleNavClick}
            >
              Sigue tu historia
            </NavLink>
          )}

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
        </div>
      )}
    </div>
  );
};
