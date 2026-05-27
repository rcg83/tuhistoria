import { Logo } from '../logo/Logo.tsx';
import { NavButton } from '../navigation/NavButton';
import { useStories } from '../../features/stories/context/StoriesContext';
import './Leftbar.scss';

export const Leftbar = () => {
  const { selected } = useStories();

  return (
    <nav className='leftbar'>
      <div className="leftbar__logo-container">
        <Logo className='leftbar__logo light-theme'/>
      </div>
      <div className="leftbar__nav">
        {selected && (
          <NavButton to={`/story/${selected._id}`}>Sigue tu historia</NavButton>
        )}
        <NavButton to="/stories">Historias</NavButton>
      </div>
    </nav>
  );
}
