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
          {story.createdAt && (
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4, marginTop: -2 }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatDate(story.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
