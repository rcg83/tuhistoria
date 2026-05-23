import { useParams } from 'react-router-dom';
import './StoryPage.scss';

export const StoryPage = () => {
  const { id } = useParams();

  return (
    <div className="story-page">
      <h1>Historia</h1>
      <p className="story-page__id">ID: {id}</p>
    </div>
  );
};
