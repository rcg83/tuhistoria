import type { Story } from 'src/features/stories/context/StoriesContext';
import './StoryCard.scss';

interface StoryCardProps {
  story: Story;
  isActive: boolean;
  onClick: () => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const StoryCard = ({ story, isActive, onClick }: StoryCardProps) => {
  return (
    <div
      className={`story-card${isActive ? ' story-card--active' : ''}`}
      onClick={onClick}
    >
      {story.template.imageUrl && (
        <img
          className="story-card__image"
          src={story.template.imageUrl}
          alt=""
        />
      )}
      <div className="story-card__body">
        <h3 className="story-card__title">{story.template.title}</h3>
        <p className="story-card__desc">{story.template.description}</p>
        <div className="story-card__meta">
          {story.createdAt && <span>🕐 {formatDate(story.createdAt)}</span>}
        </div>
      </div>
    </div>
  );
};
