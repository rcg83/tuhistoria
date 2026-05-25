import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStories } from '../../features/stories/context/StoriesContext';
import './HamburgerMenu.scss';

export const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { stories, selected, selectStory } = useStories();

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

  const handleStoryClick = (storyId: string) => {
    const story = stories.find((s) => s._id === storyId);
    if (story) selectStory(story);
    navigate('/stories');
    setOpen(false);
  };

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
            to="/stories"
            end
            className={({ isActive }) =>
              `hamburger-menu__link${isActive ? ' hamburger-menu__link--active' : ''}`
            }
            onClick={handleNavClick}
          >
            Historias
          </NavLink>

          {stories.length > 0 && (
            <>
              <div className="hamburger-menu__divider" />
              {stories.map((s) => (
                <button
                  key={s._id}
                  className={`hamburger-menu__story-item${selected?._id === s._id ? ' hamburger-menu__story-item--active' : ''}`}
                  onClick={() => handleStoryClick(s._id)}
                >
                  {s.template.title}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
